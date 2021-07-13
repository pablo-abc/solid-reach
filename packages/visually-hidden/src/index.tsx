import { Component, JSX, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

type VisuallyHiddenProps = {
  children?: JSX.Element;
  as?: Component | string;
  ref?: HTMLElement | ((el: HTMLElement) => void) | undefined;
  style?: JSX.CSSProperties;
  [key: string]: unknown;
};

export default function VisuallyHidden(props: VisuallyHiddenProps) {
  props = mergeProps({ as: 'span', style: {} }, props);
  const [local, others] = splitProps(props, ['children', 'as', 'style']);
  return (
    <Dynamic<JSX.HTMLAttributes<HTMLSpanElement>>
      ref={props.ref}
      style={{
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: '1px',
        margin: '-1px',
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        width: '1px',
        'white-space': 'nowrap',
        'word-wrap': 'normal',
        ...local.style,
      }}
      component={local.as}
      {...others}
    >
      {local.children}
    </Dynamic>
  );
}
