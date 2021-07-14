import { JSX, mergeProps, splitProps, Component } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export type SkipNavContentProps = {
  children?: JSX.Element;
  as?: Component | string;
  contentId?: string;
  ref?: HTMLElement | ((el: HTMLElement) => void) | undefined;
} & JSX.HTMLAttributes<HTMLDivElement>;

export default function SkipNavContent(props: SkipNavContentProps) {
  props = mergeProps({ as: 'div' }, props);
  const [local, others] = splitProps(props, ['as', 'children', 'ref', 'id']);
  const id = () => local.id || 'reach-skip-nav';

  return (
    <Dynamic<JSX.HTMLAttributes<HTMLDivElement>>
      {...others}
      component={local.as}
      ref={props.ref}
      id={id()}
      data-reach-skip-nav-content=""
    >
      {local.children}
    </Dynamic>
  );
}
