import {
  mergeProps,
  splitProps,
  createSignal,
  onCleanup,
  Accessor,
  createEffect,
} from 'solid-js';
import observeRect from '@reach/observe-rect';
import { Dynamic } from 'solid-js/web';
import { composeRefs, getOwnerDocument } from '@solid-reach/utils';
import { PopoverProps, PossibleNode } from './types';
import { getStyles, positionDefault } from './utils';
import { tabbable } from 'tabbable';

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

  useSimulateTabNavigation(() => local.targetRef as any, popoverRef);

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

function useSimulateTabNavigation<T extends HTMLElement, P extends HTMLElement>(
  triggerRef: Accessor<T | undefined>,
  popoverRef: { current?: P }
) {
  const ownerDocument = getOwnerDocument(triggerRef())!;

  function handleKeyDown(event: KeyboardEvent) {
    if (
      event.key === 'Tab' &&
      popoverRef.current &&
      tabbable(popoverRef.current).length === 0
    ) {
      return;
    }

    if (event.key === 'Tab' && event.shiftKey) {
      if (shiftTabbedFromElementAfterTrigger(event)) {
        focusLastTabbableInPopover(event);
      } else if (shiftTabbedOutOfPopover(event)) {
        focusTriggerRef(event);
      } else if (shiftTabbedToBrowserChrome(event)) {
        disableTabbablesInPopover();
      }
    } else if (event.key === 'Tab') {
      if (tabbedFromTriggerToPopover()) {
        focusFirstPopoverTabbable(event);
      } else if (tabbedOutOfPopover()) {
        focusTabbableAfterTrigger(event);
      } else if (tabbedToBrowserChrome(event)) {
        disableTabbablesInPopover();
      }
    }
  }

  createEffect(() => {
    ownerDocument.addEventListener('keydown', handleKeyDown);
    onCleanup(() => {
      ownerDocument.removeEventListener('keydown', handleKeyDown);
    });
  });

  function getElementAfterTrigger() {
    const currentTriggerRef = triggerRef();
    if (!currentTriggerRef) return;
    const elements = tabbable(ownerDocument.body);
    const targetIndex =
      elements && triggerRef() ? elements.indexOf(currentTriggerRef) : -1;
    const elementAfterTrigger = elements && elements[targetIndex + 1];
    return popoverRef.current &&
      popoverRef.current.contains(elementAfterTrigger || null)
      ? false
      : elementAfterTrigger;
  }

  function tabbedFromTriggerToPopover() {
    return triggerRef() ? triggerRef() === ownerDocument.activeElement : false;
  }

  function focusFirstPopoverTabbable(event: KeyboardEvent) {
    const elements = popoverRef.current && tabbable(popoverRef.current);
    if (elements && elements[0]) {
      event.preventDefault();
      elements[0].focus();
    }
  }

  function tabbedOutOfPopover() {
    const inPopover = popoverRef.current
      ? popoverRef.current.contains(ownerDocument.activeElement || null)
      : false;
    if (inPopover) {
      const elements = popoverRef.current && tabbable(popoverRef.current);
      return Boolean(
        elements &&
          elements[elements.length - 1] === ownerDocument.activeElement
      );
    }
    return false;
  }

  function focusTabbableAfterTrigger(event: KeyboardEvent) {
    const elementAfterTrigger = getElementAfterTrigger();
    if (elementAfterTrigger) {
      event.preventDefault();
      elementAfterTrigger.focus();
    }
  }

  function shiftTabbedFromElementAfterTrigger(event: KeyboardEvent) {
    if (!event.shiftKey) return;
    const elementAfterTrigger = getElementAfterTrigger();
    return event.target === elementAfterTrigger;
  }

  function focusLastTabbableInPopover(event: KeyboardEvent) {
    const elements = popoverRef.current && tabbable(popoverRef.current);
    const last = elements && elements[elements.length - 1];
    if (last) {
      event.preventDefault();
      last.focus();
    }
  }

  function shiftTabbedOutOfPopover(event: KeyboardEvent) {
    const elements = popoverRef.current && tabbable(popoverRef.current);
    if (elements) {
      return elements.length === 0 ? false : event.target === elements[0];
    }
    return false;
  }

  function focusTriggerRef(event: KeyboardEvent) {
    event.preventDefault();
    triggerRef()?.focus();
  }

  function tabbedToBrowserChrome(event: KeyboardEvent) {
    const elements = popoverRef.current
      ? tabbable(ownerDocument.body).filter(
          (element) => !popoverRef.current!.contains(element)
        )
      : null;
    return elements ? event.target === elements[elements.length - 1] : false;
  }

  function shiftTabbedToBrowserChrome(event: KeyboardEvent) {
    // we're assuming the popover will never contain the first tabbable
    // element, and it better not, because the trigger needs to be tabbable!
    return event.target === tabbable(ownerDocument.body)[0];
  }

  let restoreTabIndexTuples: [PossibleNode, number][] = [];

  function disableTabbablesInPopover() {
    const elements = popoverRef.current && tabbable(popoverRef.current);
    if (elements) {
      elements.forEach((element) => {
        restoreTabIndexTuples.push([element, element.tabIndex]);
        element.tabIndex = -1;
      });
      ownerDocument.addEventListener('focusin', enableTabbablesInPopover);
    }
  }

  function enableTabbablesInPopover() {
    ownerDocument.removeEventListener('focusin', enableTabbablesInPopover);
    restoreTabIndexTuples.forEach(([element, tabIndex]) => {
      if (!element) return;
      element.tabIndex = tabIndex;
    });
  }
}
