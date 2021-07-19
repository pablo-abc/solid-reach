import { JSX, mergeProps, splitProps, Component, createMemo } from 'solid-js';
import { useCheckStyles } from '@solid-reach/utils';
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

  const id = createMemo(() => local.contentId || 'reach-skip-nav');

  useCheckStyles('skip-nav');

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
