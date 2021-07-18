import {
  mergeProps,
  splitProps,
  createSignal,
  onCleanup,
  createEffect,
} from 'solid-js';
import observeRect from '@reach/observe-rect';
import { Dynamic } from 'solid-js/web';
import { composeRefs } from '@solid-reach/utils';
import { PopoverProps } from './types';
import { getStyles, positionDefault } from './utils';

export default function PopoverImpl(props: PopoverProps) {
  props = mergeProps({ as: 'div', position: positionDefault }, props);
  const [local, others] = splitProps(props, [
    'as',
    'ref',
    'targetRef',
    'position',
    'children',
    'style',
  ]);
  const popoverRef: { current?: HTMLDivElement } = {};
  const [popoverRect, setPopoverRect] = createSignal<DOMRect>();
  const [targetRect, setTargetRect] = createSignal<DOMRect>();

  createEffect(() => {
    if (!popoverRef.current) return;
    const popoverObserver = observeRect(popoverRef.current, setPopoverRect);
    popoverObserver.observe();
    onCleanup(() => popoverObserver.unobserve());
  });

  createEffect(() => {
    if (!local.targetRef) return;
    const targetObserver = observeRect(local.targetRef, setTargetRect);
    targetObserver.observe();
    onCleanup(() => targetObserver.unobserve());
  });

  const styles = () => getStyles(local.position!, targetRect(), popoverRect());

  // TODO: handle tab navigation??
  return (
    <Dynamic<Omit<PopoverProps, 'targetRef'>>
      data-reach-popover=""
      ref={composeRefs(popoverRef, props)}
      {...others}
      style={{
        position: 'absolute',
        ...styles(),
        ...(typeof local.style === 'object' && local.style),
      }}
      component={local.as}
    >
      {local.children}
    </Dynamic>
  );
}
