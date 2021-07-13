import { composeRefs } from '@solid-reach/utils';
import { JSX, Component, useContext, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { DisclosureContext } from './context';

type DisclosureButtonProps = {
  children: JSX.Element;
  ref?: HTMLElement | ((el: HTMLElement) => void) | undefined;
  as?: Component | string;
  [key: string]: unknown;
};

export default function DisclosureButton(props: DisclosureButtonProps) {
  props = mergeProps({ as: 'button' }, props);
  const [local, others] = splitProps(props, ['as', 'children', 'ref']);
  const button: { current?: HTMLButtonElement } = {};
  const context = useContext(DisclosureContext);

  function handleClick(event: MouseEvent) {
    event.preventDefault();
    button.current && button.current.focus();
    context.onSelect();
  }

  return (
    <Dynamic<JSX.HTMLAttributes<HTMLButtonElement>>
      aria-controls={context.panelId}
      aria-expanded={context.open()}
      id={`button---${context.disclosureId}`}
      {...others}
      component={local.as}
      onClick={handleClick}
      ref={composeRefs<HTMLButtonElement>(button, props)}
      data-reach-disclosure-button=""
      data-state={context.open() ? 'open' : 'collapsed'}
    >
      {local.children}
    </Dynamic>
  );
}
