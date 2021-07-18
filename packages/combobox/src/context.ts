import { createContext, useContext, Accessor } from 'solid-js';
import { Store } from 'solid-js/store';
import { StateData, ComboboxValue, State, Transition } from './machine';

type Ref<T> = { current?: T };

export type InternalComboboxContextValue = {
  ariaLabel?: string;
  ariaLabelledby?: string;
  autocompletePropRef: Ref<any>;
  buttonRef: Ref<HTMLButtonElement | undefined>;
  comboboxId: Accessor<string | undefined>;
  data: Store<StateData>;
  inputRef: Ref<HTMLInputElement | undefined>;
  isExpanded: Accessor<boolean>;
  listboxId: Accessor<string>;
  onSelect(value?: ComboboxValue): any;
  openOnFocus: Accessor<boolean>;
  persistSelectionRef: Ref<boolean>;
  popoverRef: Ref<HTMLDivElement | undefined>;
  state: Accessor<State>;
  transition: Transition;
  setListRef(list: HTMLElement): void;
  descendants: Accessor<HTMLElement[]>;
};

export interface ComboboxOptionContextValue {
  value: Accessor<ComboboxValue>;
  index: Accessor<number>;
}

export interface ComboboxContextValue {
  id: Accessor<string | undefined>;
  isExpanded: Accessor<boolean>;
  navigationValue: Accessor<ComboboxValue | null>;
  state: Accessor<State>;
}

export const ComboboxContext = createContext(
  {} as InternalComboboxContextValue
);

export const ComboboxOptionContext = createContext(
  {} as ComboboxOptionContextValue
);

export function useComboboxOptionContext() {
  return useContext(ComboboxOptionContext);
}

export function useInternalComboboxContext() {
  return useContext(ComboboxContext);
}

export function useComboboxContext(): ComboboxContextValue {
  const { isExpanded, comboboxId, data, state } = useInternalComboboxContext();
  return {
    id: comboboxId,
    isExpanded,
    navigationValue: () => data.navigationValue ?? null,
    state,
  };
}
