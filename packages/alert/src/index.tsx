import { composeRefs } from '@solid-reach/utils';
import { Component, JSX, createMemo, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useMirrorEffects } from './mirror';

type AlertProps = {
  as?: Component | string;
  ref?: HTMLDivElement | ((el: HTMLDivElement) => void);
  children: JSX.Element;
  type?: 'assertive' | 'polite';
} & JSX.HTMLAttributes<HTMLDivElement>;

export default function Alert(props: AlertProps) {
  props = mergeProps({ as: 'div', type: 'polite' }, props);
  const [local, others] = splitProps(props, ['as', 'ref', 'children', 'type']);
  const ownRef: { current?: HTMLDivElement } = {};
  const child = createMemo(() => (
    <Dynamic
      {...others}
      component={local.as}
      data-reach-alert=""
      ref={composeRefs(ownRef, props)}
    >
      {local.children}
    </Dynamic>
  ));
  useMirrorEffects(
    () => local.type!,
    child,
    () => ownRef.current
  );

  return child();
}
