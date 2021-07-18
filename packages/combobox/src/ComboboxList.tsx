import { Component, JSX, mergeProps, splitProps, onMount } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { composeRefs } from '@solid-reach/utils';
import { useInternalComboboxContext } from './context';

export type ComboboxListProps = {
  persistSelection?: boolean;
  as?: Component | string;
} & JSX.HTMLAttributes<HTMLUListElement>;

export default function ComboboxList(props: ComboboxListProps) {
  props = mergeProps({ as: 'ul', persistSelection: false }, props);
  const [local, others] = splitProps(props, [
    'as',
    'ref',
    'children',
    'persistSelection',
  ]);
  const { persistSelectionRef, listboxId, setListRef } =
    useInternalComboboxContext();

  const ownRef: { current?: HTMLUListElement } = {};
  if (local.persistSelection) {
    persistSelectionRef.current = true;
  }

  onMount(() => {
    setListRef(ownRef.current!);
  });

  return (
    <Dynamic<ComboboxListProps>
      role="listbox"
      {...others}
      ref={composeRefs(ownRef, props)}
      component={local.as}
      data-reach-combobox-list=""
      id={listboxId()}
    >
      {local.children}
    </Dynamic>
  );
}
