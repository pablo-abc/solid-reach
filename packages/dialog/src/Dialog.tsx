import { JSX, mergeProps, splitProps } from 'solid-js';
import { noop } from '@solid-reach/utils';
import { DialogProps } from './types';
import DialogContent from './DialogContent';
import DialogOverlay from './DialogOverlay';

export default function Dialog(
  props: DialogProps & JSX.HTMLAttributes<HTMLDivElement>
) {
  props = mergeProps({ onDismiss: noop }, props);
  const [local, others] = splitProps(props, [
    'initialFocusRef',
    'isOpen',
    'onDismiss',
    'children',
    'ref',
  ]);

  return (
    <DialogOverlay
      initialFocusRef={local.initialFocusRef}
      isOpen={local.isOpen}
      onDismiss={local.onDismiss}
    >
      <DialogContent ref={props.ref} {...others}>
        {local.children}
      </DialogContent>
    </DialogOverlay>
  );
}
