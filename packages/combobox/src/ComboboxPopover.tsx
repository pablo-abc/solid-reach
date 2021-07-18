import { Component, JSX, mergeProps, splitProps, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import Popover, {
  PopoverProps,
  positionMatchWidth,
} from '@solid-reach/popover';
import { useInternalComboboxContext } from './context';
import { composeEventHandler, composeRefs } from '@solid-reach/utils';
import { useBlur, useKeyDown } from './handlers';

export type ComboboxPopoverProps = {
  as?: Component | string;
  portal?: boolean;
} & Partial<PopoverProps> &
  JSX.HTMLAttributes<HTMLDivElement>;

export default function ComboboxPopover(props: ComboboxPopoverProps) {
  props = mergeProps(
    { as: 'div', portal: true, position: positionMatchWidth },
    props
  );
  const [local, others] = splitProps(props, [
    'as',
    'ref',
    'children',
    'portal',
    'onKeyDown',
    'onBlur',
    'position',
  ]);

  const { popoverRef, inputRef, isExpanded, state } =
    useInternalComboboxContext();

  const handleKeyDown = useKeyDown();
  const handleBlur = useBlur();

  const sharedProps = {
    'data-reach-combobox-popover': '',
    onKeyDown: composeEventHandler(local.onKeyDown, handleKeyDown),
    onBlur: composeEventHandler(local.onBlur, handleBlur),
    tabindex: -1,
  };

  return (
    <Show
      when={local.portal}
      fallback={
        <Dynamic<ComboboxPopoverProps>
          ref={composeRefs(popoverRef, props)}
          {...others}
          component={local.as}
          data-state={state().toLowerCase()}
          hidden={!isExpanded()}
          {...sharedProps}
        >
          {local.children}
        </Dynamic>
      }
    >
      <Popover
        as={local.as}
        {...others}
        ref={composeRefs(popoverRef, props)}
        position={local.position}
        targetRef={inputRef.current}
        data-state={state().toLowerCase()}
        hidden={!isExpanded()}
        {...sharedProps}
      >
        {local.children}
      </Popover>
    </Show>
  );
}
