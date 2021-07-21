import {
  createRenderEffect,
  Accessor,
  Component,
  JSX,
  mergeProps,
  splitProps,
  createSignal,
  createMemo,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import {
  createDescendants,
  createId,
  noop,
  useCheckStyles,
} from '@solid-reach/utils';
import {
  ComboboxContext,
  ComboboxContextValue,
  InternalComboboxContextValue,
} from './context';
import {
  MachineEventType,
  NAVIGATE,
  ESCAPE,
  SELECT_WITH_CLICK,
  OPEN_WITH_BUTTON,
  ComboboxValue,
  useComboboxMachine,
  popoverIsExpanded,
} from './machine';

export type ComboboxProps = {
  children:
    | JSX.Element
    | string
    | ((props: ComboboxContextValue) => JSX.Element);
  onSelect?(value: ComboboxValue): void;
  openOnFocus?: boolean;
  as?: Component | string;
} & Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onSelect'>;

function useFocusManagement(
  lastEventType: Accessor<MachineEventType | undefined>,
  inputRef: Accessor<HTMLInputElement | null | undefined>
) {
  createRenderEffect(() => {
    if (
      lastEventType() === NAVIGATE ||
      lastEventType() === ESCAPE ||
      lastEventType() === SELECT_WITH_CLICK ||
      lastEventType() === OPEN_WITH_BUTTON
    ) {
      inputRef()?.focus();
    }
  });
}

export default function Combobox(props: ComboboxProps) {
  props = mergeProps({ as: 'div', openOnFocus: false }, props);
  const [local, others] = splitProps(props, [
    'children',
    'ref',
    'as',
    'onSelect',
    'openOnFocus',
  ]);

  const [listRef, setListRef] = createSignal<HTMLElement | undefined>();
  const descendants = createDescendants(
    listRef,
    '[data-reach-combobox-option=""]'
  );

  const inputRef: { current?: HTMLInputElement } = {};
  const popoverRef: { current?: HTMLDivElement } = {};
  const buttonRef: { current?: HTMLButtonElement } = {};
  const autocompletePropRef: { current: boolean } = { current: false };
  const persistSelectionRef: { current: boolean } = { current: false };
  const [state, data, transition] = useComboboxMachine();
  useFocusManagement(
    () => data.lastEventType,
    () => inputRef.current
  );
  const id = createMemo(() => createId(props.id));
  const listboxId = () => (id() ? `listbox---${id()}` : 'listbox');
  const context: InternalComboboxContextValue = {
    ariaLabel: props['aria-label'],
    ariaLabelledby: props['aria-labelledby'],
    autocompletePropRef,
    buttonRef,
    comboboxId: id,
    data,
    inputRef,
    isExpanded: () => popoverIsExpanded(state()),
    listboxId,
    onSelect: local.onSelect || noop,
    openOnFocus: () => local.openOnFocus!,
    persistSelectionRef,
    popoverRef,
    state,
    transition,
    setListRef,
    descendants,
    isFocusedRef: { current: false },
  };

  useCheckStyles('combobox');

  return (
    <ComboboxContext.Provider value={context}>
      <Dynamic<ComboboxProps>
        {...others}
        component={local.as}
        data-reach-combobox=""
        data-state={state().toLowerCase()}
        ref={props.ref}
      >
        {typeof local.children === 'function'
          ? local.children({
              id,
              isExpanded: () => popoverIsExpanded(state()),
              state,
              navigationValue: () => data.navigationValue ?? null,
            })
          : local.children}
      </Dynamic>
    </ComboboxContext.Provider>
  );
}
