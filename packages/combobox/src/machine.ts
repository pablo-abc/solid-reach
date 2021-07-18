import { createSignal, Accessor } from 'solid-js';
import { createStore, Store } from 'solid-js/store';

export type Transition = (event: MachineEventType, payload?: any) => any;

export type ComboboxValue = string;

export type State = 'IDLE' | 'SUGGESTING' | 'NAVIGATING' | 'INTERACTING';

export type MachineEventType =
  | 'CLEAR'
  | 'CHANGE'
  | 'INITIAL_CHANGE'
  | 'NAVIGATE'
  | 'SELECT_WITH_KEYBOARD'
  | 'SELECT_WITH_CLICK'
  | 'ESCAPE'
  | 'BLUR'
  | 'INTERACT'
  | 'FOCUS'
  | 'OPEN_WITH_INPUT_CLICK'
  | 'OPEN_WITH_BUTTON'
  | 'CLOSE_WITH_BUTTON';

export interface StateChart {
  initial: State;
  states: {
    [key in State]?: {
      on: {
        [key in MachineEventType]?: State;
      };
    };
  };
}

export interface StateData {
  lastEventType?: MachineEventType;
  navigationValue?: ComboboxValue | null;
  value?: ComboboxValue | null;
}

export type MachineEvent =
  | { type: 'BLUR' }
  | { type: 'CHANGE'; value: ComboboxValue }
  | { type: 'INITIAL_CHANGE'; value: ComboboxValue }
  | { type: 'CLEAR' }
  | { type: 'CLOSE_WITH_BUTTON' }
  | { type: 'ESCAPE' }
  | { type: 'FOCUS' }
  | { type: 'INTERACT' }
  | {
      type: 'NAVIGATE';
      persistSelection?: boolean;
      value: ComboboxValue;
    }
  | { type: 'OPEN_WITH_BUTTON' }
  | { type: 'OPEN_WITH_INPUT_CLICK' }
  | {
      type: 'SELECT_WITH_CLICK';
      value: ComboboxValue;
    }
  | {
      type: 'SELECT_WITH_KEYBOARD';
    };

export type Reducer = (data: StateData, event: MachineEvent) => StateData;

////////////////////////////////////////////////////////////////////////////////
// States

// Nothing going on, waiting for the user to type or use the arrow keys
export const IDLE = 'IDLE';

// The component is suggesting options as the user types
export const SUGGESTING = 'SUGGESTING';

// The user is using the keyboard to navigate the list, not typing
export const NAVIGATING = 'NAVIGATING';

// The user is interacting with arbitrary elements inside the popup that
// are not ComboboxInputs
export const INTERACTING = 'INTERACTING';

////////////////////////////////////////////////////////////////////////////////
// Events

// User cleared the value w/ backspace, but input still has focus
export const CLEAR = 'CLEAR';

// User is typing
export const CHANGE = 'CHANGE';

// Initial input value change handler for syncing user state with state machine
// Prevents initial change from sending the user to the NAVIGATING state
// https://github.com/reach/reach-ui/issues/464
export const INITIAL_CHANGE = 'INITIAL_CHANGE';

// User is navigating w/ the keyboard
export const NAVIGATE = 'NAVIGATE';

// User can be navigating with keyboard and then click instead, we want the
// value from the click, not the current nav item
export const SELECT_WITH_KEYBOARD = 'SELECT_WITH_KEYBOARD';
export const SELECT_WITH_CLICK = 'SELECT_WITH_CLICK';

// Pretty self-explanatory, user can hit escape or blur to close the popover
export const ESCAPE = 'ESCAPE';
export const BLUR = 'BLUR';

// The user left the input to interact with arbitrary elements inside the popup
export const INTERACT = 'INTERACT';

export const FOCUS = 'FOCUS';

export const OPEN_WITH_BUTTON = 'OPEN_WITH_BUTTON';

export const OPEN_WITH_INPUT_CLICK = 'OPEN_WITH_INPUT_CLICK';

export const CLOSE_WITH_BUTTON = 'CLOSE_WITH_BUTTON';

////////////////////////////////////////////////////////////////////////////////
const stateChart: StateChart = {
  initial: IDLE,
  states: {
    [IDLE]: {
      on: {
        [BLUR]: IDLE,
        [CLEAR]: IDLE,
        [CHANGE]: SUGGESTING,
        [INITIAL_CHANGE]: IDLE,
        [FOCUS]: SUGGESTING,
        [NAVIGATE]: NAVIGATING,
        [OPEN_WITH_BUTTON]: SUGGESTING,
        [OPEN_WITH_INPUT_CLICK]: SUGGESTING,
      },
    },
    [SUGGESTING]: {
      on: {
        [CHANGE]: SUGGESTING,
        [FOCUS]: SUGGESTING,
        [NAVIGATE]: NAVIGATING,
        [CLEAR]: IDLE,
        [ESCAPE]: IDLE,
        [BLUR]: IDLE,
        [SELECT_WITH_CLICK]: IDLE,
        [INTERACT]: INTERACTING,
        [CLOSE_WITH_BUTTON]: IDLE,
      },
    },
    [NAVIGATING]: {
      on: {
        [CHANGE]: SUGGESTING,
        [FOCUS]: SUGGESTING,
        [CLEAR]: IDLE,
        [BLUR]: IDLE,
        [ESCAPE]: IDLE,
        [NAVIGATE]: NAVIGATING,
        [SELECT_WITH_CLICK]: IDLE,
        [SELECT_WITH_KEYBOARD]: IDLE,
        [CLOSE_WITH_BUTTON]: IDLE,
        [INTERACT]: INTERACTING,
      },
    },
    [INTERACTING]: {
      on: {
        [CLEAR]: IDLE,
        [CHANGE]: SUGGESTING,
        [FOCUS]: SUGGESTING,
        [BLUR]: IDLE,
        [ESCAPE]: IDLE,
        [NAVIGATE]: NAVIGATING,
        [CLOSE_WITH_BUTTON]: IDLE,
        [SELECT_WITH_CLICK]: IDLE,
      },
    },
  },
};

const reducer: Reducer = (data: StateData, event: MachineEvent) => {
  const nextState = { ...data, lastEventType: event.type };
  switch (event.type) {
    case CHANGE:
    case INITIAL_CHANGE:
      return {
        ...nextState,
        navigationValue: null,
        value: event.value,
      };
    case NAVIGATE:
    case OPEN_WITH_BUTTON:
    case OPEN_WITH_INPUT_CLICK:
      return {
        ...nextState,
        navigationValue: findNavigationValue(nextState, event),
      };
    case CLEAR:
      return {
        ...nextState,
        value: '',
        navigationValue: null,
      };
    case BLUR:
    case ESCAPE:
      return {
        ...nextState,
        navigationValue: null,
      };
    case SELECT_WITH_CLICK:
      return {
        ...nextState,
        value: event.value,
        navigationValue: null,
      };
    case SELECT_WITH_KEYBOARD:
      return {
        ...nextState,
        value: data.navigationValue,
        navigationValue: null,
      };
    case CLOSE_WITH_BUTTON:
      return {
        ...nextState,
        navigationValue: null,
      };
    case INTERACT:
      return nextState;
    case FOCUS:
      return {
        ...nextState,
        navigationValue: findNavigationValue(nextState, event),
      };

    default:
      return nextState;
  }
};

export function popoverIsExpanded(state: State) {
  return [SUGGESTING, NAVIGATING, INTERACTING].includes(state);
}

/**
 * When we open a list, set the navigation value to the value in the input, if
 * it's in the list, then it'll automatically be highlighted.
 *
 * @param stateData
 * @param event
 */
function findNavigationValue(stateData: StateData, event: MachineEvent) {
  // @ts-ignore
  if (event.value) {
    // @ts-ignore
    return event.value;
    // @ts-ignore
  } else if (event.persistSelection) {
    return stateData.value;
  } else {
    return null;
  }
}

function useReducer<T extends StateData>(
  reducer: Reducer,
  initialData: T
): [Store<StateData>, (event: MachineEvent) => void] {
  const [data, setData] = createStore<StateData>(initialData);

  function dispatch(event: MachineEvent) {
    const newData = reducer(data, event);
    setData(newData);
  }
  return [data, dispatch];
}

/**
 * This manages transitions between states with a built in reducer to manage
 * the data that goes with those transitions.
 *
 * @param chart
 * @param reducer
 * @param initialData
 */
function useReducerMachine(
  chart: StateChart,
  reducer: Reducer,
  initialData: Partial<StateData>
): [Accessor<State>, Store<StateData>, Transition] {
  const [state, setState] = createSignal(chart.initial);
  const [data, dispatch] = useReducer(reducer, initialData);

  const transition: Transition = (event, payload = {}) => {
    const currentState = chart.states[state()];
    const nextState = currentState && currentState.on[event];
    if (nextState) {
      dispatch({ type: event, state: state(), nextState: state(), ...payload });
      setState(nextState);
      return;
    }
  };

  return [state, data, transition];
}

export function useComboboxMachine() {
  const defaultData: StateData = {
    // The value the user has typed. We derive this also when the developer is
    // controlling the value of ComboboxInput.
    value: '',
    // the value the user has navigated to with the keyboard
    navigationValue: null,
  };
  return useReducerMachine(stateChart, reducer, defaultData);
}
