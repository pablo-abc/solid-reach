import {
  Component,
  JSX,
  mergeProps,
  splitProps,
  createMemo,
  Show,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { composeEventHandler, composeRefs } from '@solid-reach/utils';
import {
  ComboboxOptionContext,
  ComboboxOptionContextValue,
  useInternalComboboxContext,
} from './context';
import { SELECT_WITH_CLICK } from './machine';
import { makeHash } from './utils';
import ComboboxOptionText from './ComboboxOptionText';

export type ComboboxOptionProps = {
  as?: Component | string;
  children?: JSX.Element | ((props: ComboboxOptionContextValue) => JSX.Element);
  value: string;
} & JSX.HTMLAttributes<HTMLLIElement>;

export default function ComboboxOption(props: ComboboxOptionProps) {
  props = mergeProps({ as: 'li' }, props);
  const [local, others] = splitProps(props, [
    'as',
    'children',
    'ref',
    'value',
    'onClick',
  ]);
  const {
    onSelect,
    data,
    transition,
    descendants: options,
  } = useInternalComboboxContext();
  const ownRef: { current?: HTMLLIElement } = {};
  const index = createMemo(() =>
    options().findIndex((option) => option === ownRef.current)
  );

  const isActive = () => data.navigationValue === local.value;

  const handleClick = composeEventHandler(local.onClick, () => {
    onSelect && onSelect(local.value);
    transition(SELECT_WITH_CLICK, { value: local.value });
  });

  return (
    <ComboboxOptionContext.Provider value={{ value: () => local.value, index }}>
      <Dynamic<Omit<ComboboxOptionProps, 'value'>>
        aria-selected={isActive()}
        role="option"
        {...others}
        component={local.as}
        data-reach-combobox-option=""
        ref={composeRefs(ownRef, props)}
        id={String(makeHash(local.value))}
        data-highlighted={isActive() ? '' : undefined}
        tabindex={-1}
        onClick={handleClick}
        data-value={local.value}
      >
        <Show when={local.children} fallback={<ComboboxOptionText />}>
          {typeof local.children === 'function'
            ? local.children({
                value: () => local.value,
                index,
              })
            : local.children}
        </Show>
      </Dynamic>
    </ComboboxOptionContext.Provider>
  );
}
