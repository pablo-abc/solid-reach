import { JSX, Component, useContext, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { DisclosureContext } from './context';

type DisclosurePanelProps = {
  children: JSX.Element;
  ref?: HTMLElement | ((el: HTMLElement) => void) | undefined;
  as?: Component | string;
} & JSX.HTMLAttributes<HTMLDivElement>;

export default function DisclosurePanel(props: DisclosurePanelProps) {
  props = mergeProps({ as: 'div' }, props);
  const [local, others] = splitProps(props, ['as', 'children', 'ref']);
  const context = useContext(DisclosureContext);

  return (
    <Dynamic<JSX.HTMLAttributes<HTMLDivElement>>
      hidden={!context.open()}
      {...others}
      ref={props.ref}
      component={local.as}
      data-reach-disclosure-panel=""
      data-state={context.open() ? 'open' : 'collapsed'}
      id={context.panelId()}
    >
      {local.children}
    </Dynamic>
  );
}
