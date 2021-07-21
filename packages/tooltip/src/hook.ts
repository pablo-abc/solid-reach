import {
  composeEventHandler,
  getOwnerDocument,
  createId,
  composeRefs,
  useCheckStyles,
} from '@solid-reach/utils';
import {
  createMemo,
  Accessor,
  JSX,
  onMount,
  createEffect,
  createSignal,
  onCleanup,
} from 'solid-js';
import { createStore, Store } from 'solid-js/store';
import observeRect from '@reach/observe-rect';
import {
  send,
  TooltipEvents,
  TooltipStates,
  state,
  subscribe,
} from './machine';

type Ref<T> = { current?: T };

export interface TriggerParams<ElementType extends HTMLElement> {
  'aria-describedby'?: string | undefined;
  'data-state': string;
  'data-reach-tooltip-trigger': string;
  ref: (ref: ElementType) => void;
  onPointerEnter: JSX.EventHandlerUnion<any, any>;
  onPointerDown: JSX.EventHandlerUnion<any, any>;
  onPointerMove: JSX.EventHandlerUnion<any, any>;
  onPointerLeave: JSX.EventHandlerUnion<any, any>;
  onMouseEnter?: JSX.EventHandlerUnion<any, any>;
  onMouseDown?: JSX.EventHandlerUnion<any, any>;
  onMouseMove?: JSX.EventHandlerUnion<any, any>;
  onMouseLeave?: JSX.EventHandlerUnion<any, any>;
  onFocus: JSX.EventHandlerUnion<any, any>;
  onBlur: JSX.EventHandlerUnion<any, any>;
  onKeyDown: JSX.EventHandlerUnion<any, any>;
}

interface TooltipParams {
  id: string;
  triggerRect: DOMRect | undefined;
  isVisible: boolean;
}

function isTooltipVisible(id: string, initial?: boolean) {
  return (
    state.context.id === id &&
    (initial
      ? state.value === TooltipStates.Visible
      : state.value === TooltipStates.Visible ||
        state.value === TooltipStates.LeavingVisible)
  );
}

/**
 * useTooltip
 *
 * @param params
 */
export function useTooltip<ElementType extends HTMLElement>({
  id: idProp,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  onPointerDown,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  onMouseDown,
  onFocus,
  onBlur,
  onKeyDown,
  disabled,
  ref: forwardedRef,
  DEBUG_STYLE,
}: {
  id?: Accessor<string | undefined>;
  ref?: Ref<ElementType>;
  disabled?: Accessor<boolean | undefined>;
  DEBUG_STYLE?: boolean;
} & Omit<JSX.HTMLAttributes<ElementType>, 'disabled' | 'id'>): [
  Store<TriggerParams<ElementType>>,
  Store<TooltipParams>,
  Accessor<boolean>
] {
  let id = createMemo(() => String(createId(idProp?.())));

  let [isVisible, setIsVisible] = createSignal(
    DEBUG_STYLE ? true : isTooltipVisible(id(), true)
  );

  // hopefully they always pass a ref if they never pass one
  const [ownRef, setOwnRef] = createSignal<HTMLElement>();

  const [triggerRect, setTriggerRect] = createSignal<DOMRect>();

  createEffect(() => {
    if (!ownRef() || !isVisible()) return;
    const triggerObserver = observeRect(ownRef()!, setTriggerRect);
    triggerObserver.observe();
    onCleanup(() => triggerObserver.unobserve());
  });

  createEffect(() => {
    return subscribe(() => {
      setIsVisible(isTooltipVisible(id()));
    });
  });

  useCheckStyles('tooltip');

  onMount(() => {
    let ownerDocument = getOwnerDocument(ownRef())!;
    function listener(event: KeyboardEvent) {
      if (
        (event.key === 'Escape' || event.key === 'Esc') &&
        state.value === TooltipStates.Visible
      ) {
        send({ type: TooltipEvents.SelectWithKeyboard });
      }
    }
    ownerDocument.addEventListener('keydown', listener);
    return () => ownerDocument.removeEventListener('keydown', listener);
  });

  useDisabledTriggerOnSafari({
    disabled,
    isVisible,
    ref: { current: ownRef() },
  });

  function wrapMouseEvent<EventType extends Event>(
    theirHandler: JSX.EventHandlerUnion<any, any> | undefined,
    ourHandler: (event: EventType) => any
  ) {
    // Use internal MouseEvent handler only if PointerEvent is not supported
    if (typeof window !== 'undefined' && 'PointerEvent' in window) {
      return theirHandler;
    }

    return composeEventHandler(theirHandler, ourHandler);
  }

  function wrapPointerEventHandler(handler: (event: PointerEvent) => any) {
    return function onPointerEvent(event: PointerEvent) {
      // Handle pointer events only from mouse device
      if (event.pointerType !== 'mouse') {
        return;
      }
      handler(event);
    };
  }

  function handleMouseEnter() {
    send({ type: TooltipEvents.MouseEnter, id: id() });
  }

  function handleMouseMove() {
    send({ type: TooltipEvents.MouseMove, id: id() });
  }

  function handleMouseLeave() {
    send({ type: TooltipEvents.MouseLeave });
  }

  function handleMouseDown() {
    // Allow quick click from one tool to another
    if (state.context.id === id()) {
      send({ type: TooltipEvents.MouseDown });
    }
  }

  function handleFocus() {
    // @ts-ignore
    if (window.__REACH_DISABLE_TOOLTIPS) {
      return;
    }
    send({ type: TooltipEvents.Focus, id: id() });
  }

  function handleBlur() {
    // Allow quick click from one tool to another
    if (state.context.id === id()) {
      send({ type: TooltipEvents.Blur });
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      send({ type: TooltipEvents.SelectWithKeyboard });
    }
  }

  const [trigger, setTrigger] = createStore<Store<TriggerParams<ElementType>>>({
    // The element that triggers the tooltip references the tooltip element with
    // `aria-describedby`.
    // https://www.w3.org/TR/wai-aria-practices-1.2/#tooltip
    'aria-describedby': isVisible() ? `tooltip---${id()}` : undefined,
    'data-state': isVisible() ? 'tooltip-visible' : 'tooltip-hidden',
    'data-reach-tooltip-trigger': '',
    ref: composeRefs({}, { ref: forwardedRef }, { ref: setOwnRef as any }),
    onPointerEnter: composeEventHandler(
      onPointerEnter,
      wrapPointerEventHandler(handleMouseEnter)
    ),
    onPointerMove: composeEventHandler(
      onPointerMove,
      wrapPointerEventHandler(handleMouseMove)
    ),
    onPointerLeave: composeEventHandler(
      onPointerLeave,
      wrapPointerEventHandler(handleMouseLeave)
    ),
    onPointerDown: composeEventHandler(
      onPointerDown,
      wrapPointerEventHandler(handleMouseDown)
    ),
    onMouseEnter: wrapMouseEvent(onMouseEnter, handleMouseEnter),
    onMouseMove: wrapMouseEvent(onMouseMove, handleMouseMove),
    onMouseLeave: wrapMouseEvent(onMouseLeave, handleMouseLeave),
    onMouseDown: wrapMouseEvent(onMouseDown, handleMouseDown),
    onFocus: composeEventHandler(onFocus, handleFocus),
    onBlur: composeEventHandler(onBlur, handleBlur),
    onKeyDown: composeEventHandler(onKeyDown, handleKeyDown),
  });

  createEffect(() => {
    setTrigger({
      'aria-describedby': isVisible() ? `tooltip---${id()}` : undefined,
      'data-state': isVisible() ? 'tooltip-visible' : 'tooltip-hidden',
    });
  });
  const [tooltip, setTooltip] = createStore<Store<TooltipParams>>({
    id: id(),
    triggerRect: triggerRect(),
    isVisible: isVisible(),
  });
  createEffect(() => {
    setTooltip({
      id: id(),
      triggerRect: triggerRect(),
      isVisible: isVisible(),
    });
  });

  return [trigger, tooltip, isVisible];
}

/**
 * This is a workaround for using tooltips with disabled controls in Safari.
 * Safari fires `pointerenter` but does not fire `pointerleave`, and
 * `onPointerEventLeave` added to the trigger element will not work.
 *
 * TODO: We may remove or modiify this behavior in a future version. Direction
 * from WAI-ARIA needed for guidance on handling disabled triggers. Tooltips
 * must be accessible by keyboard, and disabled form controls are generally
 * excluded from the tab sequence.
 *
 * @see https://github.com/reach/reach-ui/issues/564
 * @see https://github.com/w3c/aria-practices/issues/128#issuecomment-588625727
 */
function useDisabledTriggerOnSafari({
  disabled,
  isVisible,
  ref,
}: {
  disabled?: Accessor<boolean | undefined>;
  isVisible: Accessor<boolean>;
  ref: Ref<HTMLElement | undefined>;
}) {
  createEffect(() => {
    if (
      !(typeof window !== 'undefined' && 'PointerEvent' in window) ||
      !disabled?.() ||
      !isVisible()
    ) {
      return;
    }

    let ownerDocument = getOwnerDocument(ref.current)!;

    function handleMouseMove(event: MouseEvent) {
      if (!isVisible()) {
        return;
      }

      if (
        event.target instanceof Element &&
        event.target.closest(
          "[data-reach-tooltip-trigger][data-state='tooltip-visible']"
        )
      ) {
        return;
      }

      send({ type: TooltipEvents.GlobalMouseMove });
    }

    ownerDocument.addEventListener('mousemove', handleMouseMove);
    return () => {
      ownerDocument.removeEventListener('mousemove', handleMouseMove);
    };
  });
}
