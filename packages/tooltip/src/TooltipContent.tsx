import {
  Component,
  createSignal,
  JSX,
  mergeProps,
  splitProps,
  createEffect,
  onCleanup,
  Show,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import observeRect from '@reach/observe-rect';
import { composeRefs, getDocumentDimensions } from '@solid-reach/utils';
import VisuallyHidden from '@solid-reach/visually-hidden';

export type TooltipContentProps = {
  position?: Position;
  label: JSX.Element | string;
  isVisible?: boolean;
  triggerRect?: DOMRect;
  as?: Component | string;
} & JSX.HTMLAttributes<HTMLDivElement>;

type Position = (
  targetRect?: PRect | null,
  popoverRect?: PRect | null
) => JSX.CSSProperties;

type PRect = Partial<DOMRect> & {
  readonly bottom: number;
  readonly height: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly width: number;
};

function getStyles(
  position: Position,
  triggerRect: PRect,
  tooltipRect: PRect
): JSX.CSSProperties {
  let haventMeasuredTooltipYet = !tooltipRect;
  if (haventMeasuredTooltipYet) {
    return { visibility: 'hidden' };
  }
  return position(triggerRect, tooltipRect);
}

// Default offset from the trigger (e.g., if the tooltip is positioned above,
// there will be 8px between the bottom of the tooltip and the top of the trigger).
// It feels awkward when it's perfectly aligned w/ the trigger
const OFFSET_DEFAULT = 8;

export const positionTooltip: Position = (
  triggerRect,
  tooltipRect,
  offset = OFFSET_DEFAULT
) => {
  let { width: windowWidth, height: windowHeight } = getDocumentDimensions();
  if (!triggerRect || !tooltipRect) {
    return {};
  }

  let collisions = {
    top: triggerRect.top - tooltipRect.height < 0,
    right: windowWidth < triggerRect.left + tooltipRect.width,
    bottom: windowHeight < triggerRect.bottom + tooltipRect.height + offset,
    left: triggerRect.left - tooltipRect.width < 0,
  };

  let directionRight = collisions.right && !collisions.left;
  let directionUp = collisions.bottom && !collisions.top;

  return {
    left: directionRight
      ? `${triggerRect.right - tooltipRect.width + window.pageXOffset}px`
      : `${triggerRect.left + window.pageXOffset}px`,
    top: directionUp
      ? `${
          triggerRect.top - offset - tooltipRect.height + window.pageYOffset
        }px`
      : `${
          triggerRect.top + offset + triggerRect.height + window.pageYOffset
        }px`,
  };
};

export default function TooltipContent(props: TooltipContentProps) {
  props = mergeProps({ as: 'div', position: positionTooltip }, props);
  const [local, others] = splitProps(props, [
    'as',
    'ref',
    'aria-label',
    'id',
    'isVisible',
    'label',
    'position',
    'style',
    'triggerRect',
  ]);

  const hasAriaLabel = () => local['aria-label'] != null;
  const [ownRef, setOwnRef] = createSignal<HTMLElement>();
  const [tooltipRect, setTooltipRect] = createSignal<DOMRect>();

  createEffect(() => {
    if (!ownRef() || !local.isVisible) return;
    const tooltipObserver = observeRect(ownRef()!, setTooltipRect);
    tooltipObserver.observe();
    onCleanup(() => tooltipObserver.unobserve());
  });

  const styles = () =>
    local.triggerRect && tooltipRect()
      ? getStyles(local.position!, local.triggerRect, tooltipRect()!)
      : {};

  return (
    <>
      <Dynamic<Omit<TooltipContentProps, 'label'>>
        role={hasAriaLabel() ? undefined : 'tooltip'}
        {...others}
        component={local.as}
        ref={composeRefs({}, props, { ref: setOwnRef as any })}
        data-reach-tooltip=""
        id={hasAriaLabel() ? undefined : local.id}
        style={{
          ...(typeof local.style === 'object' && local.style),
          ...styles(),
        }}
      >
        {local.label}
      </Dynamic>
      <Show when={hasAriaLabel()}>
        <VisuallyHidden role="tooltip" id={local.id}>
          {local['aria-label']}
        </VisuallyHidden>
      </Show>
    </>
  );
}
