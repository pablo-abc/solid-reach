import {
  Component,
  createEffect,
  createRenderEffect,
  JSX,
  mergeProps,
  splitProps,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { composeEventHandler, composeRefs } from '@solid-reach/utils';
import { useInternalComboboxContext } from './context';
import { useBlur, useKeyDown } from './handlers';
import {
  CHANGE,
  CLEAR,
  ComboboxValue,
  FOCUS,
  IDLE,
  INITIAL_CHANGE,
  INTERACTING,
  NAVIGATING,
  OPEN_WITH_INPUT_CLICK,
  SELECT_WITH_CLICK,
} from './machine';
import { makeHash } from './utils';

export type ComboboxInputProps = {
  selectOnClick?: boolean;
  autocomplete?: boolean;
  value?: ComboboxValue;
  as?: Component | string;
} & JSX.InputHTMLAttributes<HTMLInputElement>;

export default function ComboboxInput(props: ComboboxInputProps) {
  props = mergeProps(
    { as: 'input', selectOnClick: false, autocomplete: true },
    props
  );
  const [local, others] = splitProps(props, [
    'as',
    'ref',
    'selectOnClick',
    'autocomplete',
    'onClick',
    'onChange',
    'onKeyDown',
    'onBlur',
    'onFocus',
    'value',
  ]);
  let initialControlledValue = local.value;
  let controlledValueChanged = false;
  createEffect(() => {
    if (initialControlledValue === local.value) return;
    controlledValueChanged = true;
  });

  const {
    data,
    inputRef,
    state,
    transition,
    listboxId,
    autocompletePropRef,
    openOnFocus,
    isExpanded,
    ariaLabel,
    ariaLabelledby,
    persistSelectionRef,
  } = useInternalComboboxContext();

  let selectOnClickRef = false;

  const handleKeyDown = composeEventHandler(local.onKeyDown, useKeyDown());

  const handleBlur = composeEventHandler(local.onBlur, useBlur());

  const isControlled = () => local.value != null;

  createRenderEffect(() => {
    autocompletePropRef.current = local.autocomplete;
  });

  function handleValueChange(value: ComboboxValue) {
    if (value.trim() === '') {
      transition(CLEAR);
    } else if (value === initialControlledValue && !controlledValueChanged) {
      transition(INITIAL_CHANGE, { value });
    } else {
      transition(CHANGE, { value });
    }
  }

  createEffect(() => {
    if (
      isControlled() &&
      local.value !== data.value &&
      // https://github.com/reach/reach-ui/issues/481
      (local.value!.trim() === '' ? (data.value || '').trim() !== '' : true)
    ) {
      handleValueChange(local.value!);
    }
  });

  const handleChange = composeEventHandler(local.onChange, (event: Event) => {
    const { value } = event.target as HTMLInputElement;
    if (!isControlled()) {
      handleValueChange(value);
    }
  });

  const handleFocus = composeEventHandler(local.onFocus, () => {
    if (local.selectOnClick) {
      selectOnClickRef = true;
    }

    if (openOnFocus() && data.lastEventType !== SELECT_WITH_CLICK) {
      transition(FOCUS, {
        persistSelection: persistSelectionRef.current,
      });
    }
  });

  const handleClick = composeEventHandler(local.onClick, () => {
    if (selectOnClickRef) {
      selectOnClickRef = false;
      inputRef.current?.select();
    }

    if (openOnFocus() && state() === IDLE) {
      transition(OPEN_WITH_INPUT_CLICK);
    }
  });

  const inputValue = () =>
    local.autocomplete && (state() === NAVIGATING || state() === INTERACTING)
      ? data.navigationValue || local.value || data.value
      : local.value || data.value;

  return (
    <Dynamic<ComboboxInputProps>
      aria-activedescendant={
        data.navigationValue
          ? String(makeHash(data.navigationValue!))
          : undefined
      }
      aria-autocomplete="both"
      aria-controls={listboxId()}
      aria-expanded={isExpanded()}
      aria-haspopup="listbox"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabel ? undefined : ariaLabelledby}
      role="combobox"
      {...others}
      component={local.as}
      data-reach-combobox-input=""
      data-state={state().toLowerCase()}
      ref={composeRefs(inputRef, props)}
      onBlur={handleBlur}
      onInput={handleChange}
      onClick={handleClick}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      value={inputValue() || ''}
    />
  );
}
