import { JSX, mergeProps, splitProps, createEffect, Show } from 'solid-js';
import Portal from '@solid-reach/portal';
import { DialogProps } from './types';
import DialogInner from './DialogInner';

export type DialogOverlayProps = DialogProps &
  JSX.HTMLAttributes<HTMLDivElement>;

export default function DialogOverlay(props: DialogOverlayProps) {
  props = mergeProps({ as: 'div', isOpen: true }, props);
  const [local, others] = splitProps(props, [
    'ref',
    'children',
    'as',
    'isOpen',
  ]);
  createEffect(() => {
    if (props.isOpen) {
      // @ts-ignore
      window.__REACH_DISABLE_TOOLTIPS = true;
    } else {
      requestAnimationFrame(() => {
        // @ts-ignore
        window.__REACH_DISABLE_TOOLTIPS = false;
      });
    }
  });
  return (
    <Show when={local.isOpen}>
      <Portal>
        <DialogInner as={local.as} ref={props.ref} {...others}>
          {local.children}
        </DialogInner>
      </Portal>
    </Show>
  );
}
