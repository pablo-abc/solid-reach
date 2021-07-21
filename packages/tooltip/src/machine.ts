const MOUSE_REST_TIMEOUT = 100;
const LEAVE_TIMEOUT = 500;

type StateObject = { value: TooltipStates; context: StateContext };

type MachineEvent =
  | { type: TooltipEvents.Blur }
  | { type: TooltipEvents.Focus; id: string | null }
  | { type: TooltipEvents.GlobalMouseMove }
  | { type: TooltipEvents.MouseDown }
  | { type: TooltipEvents.MouseEnter; id: string | null }
  | { type: TooltipEvents.MouseLeave }
  | { type: TooltipEvents.MouseMove; id: string | null }
  | { type: TooltipEvents.Rest }
  | { type: TooltipEvents.SelectWithKeyboard }
  | { type: TooltipEvents.TimeComplete };

interface StateChart {
  initial: TooltipStates;
  states: {
    [key in TooltipStates]: {
      enter?: ActionFunction;
      leave?: ActionFunction;
      on: {
        [key in TooltipEvents]?:
          | TooltipStates
          | {
              target: TooltipStates;
              cond?: (context: StateContext, event: MachineEvent) => boolean;
              actions?: ActionFunction[];
            };
      };
    };
  };
}

type ActionFunction = (context: StateContext, event: MachineEvent) => void;

type StateContext = {
  id?: string | null;
};

export enum TooltipStates {
  // Nothing goin' on
  Idle = 'IDLE',

  // We're considering showing the tooltip, but we're gonna wait a sec
  Focused = 'FOCUSED',

  // It's on!
  Visible = 'VISIBLE',

  // Focus has left, but we want to keep it visible for a sec
  LeavingVisible = 'LEAVING_VISIBLE',

  // The user clicked the tool, so we want to hide the thing, we can't just use
  // IDLE because we need to ignore mousemove, etc.
  Dismissed = 'DISMISSED',
}

let restTimeout: number;

function startRestTimer() {
  window.clearTimeout(restTimeout);
  restTimeout = window.setTimeout(() => {
    send({ type: TooltipEvents.Rest });
  }, MOUSE_REST_TIMEOUT);
}

function clearRestTimer() {
  window.clearTimeout(restTimeout);
}

// Manages the delay to hide the tooltip after rest leaves.
let leavingVisibleTimer: number;

function startLeavingVisibleTimer() {
  window.clearTimeout(leavingVisibleTimer);
  leavingVisibleTimer = window.setTimeout(
    () => send({ type: TooltipEvents.TimeComplete }),
    LEAVE_TIMEOUT
  );
}

function clearLeavingVisibleTimer() {
  window.clearTimeout(leavingVisibleTimer);
}

// allows us to come on back later w/o entering something else first after the
// user leaves or dismisses
function clearContextId() {
  state.context.id = null;
}

////////////////////////////////////////////////////////////////////////////////
// Events

export enum TooltipEvents {
  Blur = 'BLUR',
  Focus = 'FOCUS',
  GlobalMouseMove = 'GLOBAL_MOUSE_MOVE',
  MouseDown = 'MOUSE_DOWN',
  MouseEnter = 'MOUSE_ENTER',
  MouseLeave = 'MOUSE_LEAVE',
  MouseMove = 'MOUSE_MOVE',
  Rest = 'REST',
  SelectWithKeyboard = 'SELECT_WITH_KEYBOARD',
  TimeComplete = 'TIME_COMPLETE',
}

const chart: StateChart = {
  initial: TooltipStates.Idle,
  states: {
    [TooltipStates.Idle]: {
      enter: clearContextId,
      on: {
        [TooltipEvents.MouseEnter]: TooltipStates.Focused,
        [TooltipEvents.Focus]: TooltipStates.Visible,
      },
    },
    [TooltipStates.Focused]: {
      enter: startRestTimer,
      leave: clearRestTimer,
      on: {
        [TooltipEvents.MouseMove]: TooltipStates.Focused,
        [TooltipEvents.MouseLeave]: TooltipStates.Idle,
        [TooltipEvents.MouseDown]: TooltipStates.Dismissed,
        [TooltipEvents.Blur]: TooltipStates.Idle,
        [TooltipEvents.Rest]: TooltipStates.Visible,
      },
    },
    [TooltipStates.Visible]: {
      on: {
        [TooltipEvents.Focus]: TooltipStates.Focused,
        [TooltipEvents.MouseEnter]: TooltipStates.Focused,
        [TooltipEvents.MouseLeave]: TooltipStates.LeavingVisible,
        [TooltipEvents.Blur]: TooltipStates.LeavingVisible,
        [TooltipEvents.MouseDown]: TooltipStates.Dismissed,
        [TooltipEvents.SelectWithKeyboard]: TooltipStates.Dismissed,
        [TooltipEvents.GlobalMouseMove]: TooltipStates.LeavingVisible,
      },
    },
    [TooltipStates.LeavingVisible]: {
      enter: startLeavingVisibleTimer,
      leave: () => {
        clearLeavingVisibleTimer();
        clearContextId();
      },
      on: {
        [TooltipEvents.MouseEnter]: TooltipStates.Visible,
        [TooltipEvents.Focus]: TooltipStates.Visible,
        [TooltipEvents.TimeComplete]: TooltipStates.Idle,
      },
    },
    [TooltipStates.Dismissed]: {
      leave: () => {
        clearContextId();
      },
      on: {
        [TooltipEvents.MouseLeave]: TooltipStates.Idle,
        [TooltipEvents.Blur]: TooltipStates.Idle,
      },
    },
  },
};

/*
 * Chart context allows us to persist some data around, in Tooltip all we use
 * is the id of the current tooltip being interacted with.
 */
export let state: StateObject = {
  value: chart.initial,
  context: { id: null },
};

////////////////////////////////////////////////////////////////////////////////
// Subscriptions:
//
// We could require apps to render a <TooltipProvider> around the app and use
// React context to notify Tooltips of changes to our state machine, instead
// we manage subscriptions ourselves and simplify the Tooltip API.
//
// Maybe if default context could take a hook (instead of just a static value)
// that was rendered at the root for us, that'd be cool! But it doesn't.
let subscriptions: Function[] = [];

export function subscribe(fn: Function) {
  subscriptions.push(fn);
  return () => {
    subscriptions.splice(subscriptions.indexOf(fn), 1);
  };
}

function notify() {
  subscriptions.forEach((fn) => fn(state));
}

/**
 * Send an event to our state machine to find the next state from the current
 * state + action.
 *
 * It also manages lifecycles of the machine, (enter/leave hooks on the state
 * chart)
 *
 * @param event
 * @param payload
 */
export function send(event: MachineEvent): void {
  let { value, context, changed } = transition(state, event);
  if (changed) {
    state = { value, context };
    notify();
  }
}

function transition(
  currentState: StateObject,
  event: MachineEvent
): StateObject & { changed: boolean } {
  let stateDef = chart.states[currentState.value];
  let nextState = stateDef && stateDef.on && stateDef.on[event.type];

  // Really useful for debugging
  // console.log({ event, state, nextState, contextId: context.id });
  // !nextState && console.log("no transition taken");

  if (!nextState) {
    return { ...currentState, changed: false };
  }

  if (stateDef && stateDef.leave) {
    stateDef.leave(currentState.context, event);
  }

  const { type: _, ...payload } = event;
  // TODO: Use actions instead of directly setting context
  let context = { ...state.context, ...payload } as any;

  let nextStateValue =
    typeof nextState === 'string' ? nextState : nextState.target;
  let nextDef = chart.states[nextStateValue];
  if (nextDef && nextDef.enter) {
    nextDef.enter(currentState.context, event);
  }

  return {
    value: nextStateValue,
    context,
    changed: true,
  };
}
