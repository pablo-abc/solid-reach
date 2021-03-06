import { JSX, mergeProps, splitProps, onMount } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { composeEventHandler, composeRefs, noop } from '@solid-reach/utils';
import { DialogProps } from './types';
import { focusOn } from './focus';

type DialogInnerProps = DialogProps & JSX.HTMLAttributes<HTMLDivElement>;

export default function DialogInner(props: DialogInnerProps) {
  props = mergeProps({ as: 'div', onDismiss: noop }, props);
  const [local, others] = splitProps(props, [
    'as',
    'ref',
    'children',
    'initialFocusRef',
    'onClick',
    'onDismiss',
    'onKeyDown',
    'onMouseDown',
  ]);
  let mouseDownTarget: EventTarget | null = null;
  const overlayNode: { current?: HTMLDivElement } = {};

  function activateFocusLock() {
    const initialFocusRef = local.initialFocusRef?.();
    if (!initialFocusRef) return;
    initialFocusRef.focus();
  }

  const handleClick = composeEventHandler(
    local.onClick,
    (event: MouseEvent) => {
      if (mouseDownTarget !== event.target) return;
      event.stopPropagation();
      local.onDismiss!(event);
    }
  );

  const handleKeyDown = composeEventHandler(
    local.onKeyDown,
    (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      local.onDismiss!(event);
    }
  );

  const handleMouseDown = composeEventHandler(
    local.onMouseDown,
    (event: MouseEvent) => {
      mouseDownTarget = event.target;
    }
  );

  onMount(() => {
    focusOn(overlayNode.current!);
    activateFocusLock();
  });

  return (
    <Dynamic<JSX.HTMLAttributes<HTMLDivElement>>
      {...others}
      component={local.as}
      ref={composeRefs(overlayNode, props)}
      data-reach-dialog-overlay=""
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
    >
      {local.children}
    </Dynamic>
  );
}
