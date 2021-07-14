import { JSX, mergeProps, splitProps, Component } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export type SkipNavLinkProps = {
  children?: JSX.Element;
  as?: Component | string;
  contentId?: string;
  ref?: HTMLElement | ((el: HTMLElement) => void) | undefined;
} & JSX.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function SkipNavLink(props: SkipNavLinkProps) {
  props = mergeProps({ as: 'a', children: 'Skip to content' }, props);
  const [local, others] = splitProps(props, [
    'as',
    'children',
    'ref',
    'contentId',
  ]);
  const id = () => local.contentId || 'reach-skip-nav';

  return (
    <Dynamic<JSX.AnchorHTMLAttributes<HTMLAnchorElement>>
      {...others}
      component={local.as}
      ref={props.ref}
      href={`#${id()}`}
      data-reach-skip-nav-link=""
    >
      {local.children}
    </Dynamic>
  );
}
