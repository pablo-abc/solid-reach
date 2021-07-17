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

type RectObserver = {
  observe(): void;
  unobserve(): void;
};

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
    let targetObserver: RectObserver | undefined;
    let popoverObserver: RectObserver | undefined;
    if (local.targetRef) {
      targetObserver = observeRect(local.targetRef, setTargetRect);
      targetObserver.observe();
    }
    if (popoverRef.current) {
      popoverObserver = observeRect(popoverRef.current, setPopoverRect);
      popoverObserver.observe();
    }
    onCleanup(() => {
      targetObserver?.unobserve();
      popoverObserver?.unobserve();
    });
  });

  const styles = () => getStyles(local.position!, targetRect(), popoverRect());
  createEffect(() => console.log(styles()));

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
