import {
  Component,
  JSX,
  mergeProps,
  splitProps,
  createSignal,
  createEffect,
  createMemo,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { composeRefs } from '@solid-reach/utils';
import {
  useAccordionContext,
  AccordionItemContext,
  InternalAccordionItemContextValue,
} from './context';

export type AccordionItemProps = {
  as?: Component | string;
  children?: JSX.Element;
  disabled?: boolean;
  ref?: ((ref: HTMLElement) => any) | HTMLElement;
};

export default function AccordionItem(props: AccordionItemProps) {
  props = mergeProps({ as: 'div', disabled: false }, props);
  const [local, others] = splitProps(props, [
    'ref',
    'as',
    'children',
    'disabled',
  ]);
  const [index, setIndex] = createSignal<number>();
  const { accordionId, openPanels, readOnly, descendants } =
    useAccordionContext();
  const buttonRef: { current?: HTMLButtonElement } = {};
  const itemRef: { current?: HTMLElement } = {};

  const itemId = () =>
    typeof index() !== 'undefined' ? `${accordionId}---${index()}` : undefined;
  const panelId = () => itemId() && `panel---${itemId()}`;
  const buttonId = () => itemId() && `button---${itemId()}`;
  const state = () => {
    const opened = openPanels();
    const currentIndex = index();
    return (
      (Array.isArray(opened) && typeof currentIndex !== 'undefined'
        ? opened.includes(currentIndex) && 'open'
        : opened === currentIndex && 'open') || 'collapsed'
    );
  };

  createEffect(() => {
    if (descendants().length === 0) return;
    const foundIndex = descendants().findIndex((el) => el === itemRef.current);
    if (foundIndex === -1) return;
    setIndex(foundIndex);
  });

  const context: InternalAccordionItemContextValue = {
    disabled: createMemo(() => !!props.disabled),
    buttonId,
    index,
    itemId,
    buttonRef,
    panelId,
    state,
  };

  return (
    <AccordionItemContext.Provider value={context}>
      <Dynamic
        {...others}
        component={local.as}
        ref={composeRefs<HTMLElement>(itemRef, props)}
        data-reach-accordion-item=""
        data-state="collaped"
        data-disabled={local.disabled ? '' : undefined}
        data-read-only={readOnly() ? '' : undefined}
      >
        {local.children}
      </Dynamic>
    </AccordionItemContext.Provider>
  );
}
