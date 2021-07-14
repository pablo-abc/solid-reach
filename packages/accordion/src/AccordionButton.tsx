import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { composeEventHandler, composeRefs } from '@solid-reach/utils';
import { useAccordionContext, useAccordionItemContext } from './context';

export type AccordionButtonProps = {
  as?: Component | 'string';
  children?: JSX.Element;
  ref?: ((ref: HTMLElement) => any) | HTMLElement;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export default function AccordionButton(props: AccordionButtonProps) {
  props = mergeProps({ as: 'button' }, props);
  const [local, others] = splitProps(props, [
    'children',
    'ref',
    'as',
    'onClick',
    'onKeyDown',
    'onMouseDown',
    'onPointerDown',
    'tabindex',
  ]);
  const { onSelectPanel, descendants } = useAccordionContext();
  const {
    disabled,
    buttonId,
    buttonRef: ownRef,
    index,
    panelId,
    state,
  } = useAccordionItemContext();

  function handleClick(event: MouseEvent) {
    event.preventDefault();
    const currentIndex = index();
    if (disabled() || typeof currentIndex === 'undefined') return;
    ownRef.current?.focus();
    onSelectPanel(currentIndex);
  }

  function handleKeyDown(event: KeyboardEvent) {
    const currentIndex = index();
    if (typeof currentIndex === 'undefined') return;
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    let targetIndex;
    if (event.key === 'ArrowDown') {
      if (currentIndex === descendants().length - 1) targetIndex = 0;
      else targetIndex = currentIndex + 1;
    } else {
      if (currentIndex === 0) targetIndex = descendants().length - 1;
      else targetIndex = currentIndex - 1;
    }
    const targetButton: HTMLButtonElement | null = descendants()[
      targetIndex
    ]?.querySelector('[data-reach-accordion-button=""]');
    targetButton?.focus();
  }

  return (
    <Dynamic<JSX.ButtonHTMLAttributes<HTMLButtonElement>>
      component={local.as}
      aria-controls={panelId()}
      aria-expanded={state() === 'open'}
      tabindex={disabled() ? -1 : local.tabindex}
      {...others}
      ref={composeRefs<HTMLButtonElement>(ownRef, props)}
      data-reach-accordion-button=""
      data-state={state()}
      disabled={disabled() || undefined}
      id={buttonId()}
      onClick={composeEventHandler(local.onClick as any, handleClick)}
      onKeyDown={composeEventHandler(local.onKeyDown as any, handleKeyDown)}
    >
      {local.children}
    </Dynamic>
  );
}
