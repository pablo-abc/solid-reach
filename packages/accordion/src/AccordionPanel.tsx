import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useAccordionItemContext } from './context';

export type AccordionPanelProps = {
  as?: Component | string;
  children?: JSX.Element;
  ref?: ((ref: HTMLElement) => any) | HTMLElement;
} & JSX.HTMLAttributes<HTMLDivElement>;

export default function AccordionPanel(props: AccordionPanelProps) {
  props = mergeProps({ as: 'div' }, props);
  const [local, others] = splitProps(props, ['children', 'ref', 'as']);
  const { disabled, panelId, buttonId, state } = useAccordionItemContext();

  return (
    <Dynamic<JSX.HTMLAttributes<HTMLDivElement>>
      component={local.as}
      hidden={state() !== 'open'}
      role="region"
      aria-labelledby={buttonId()}
      {...others}
      ref={props.ref}
      data-reach-accordion-panel=""
      data-disabled={disabled() || undefined}
      data-state={state()}
      id={panelId()}
    >
      {local.children}
    </Dynamic>
  );
}
