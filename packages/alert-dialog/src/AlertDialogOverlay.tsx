import { composeRefs, createId } from '@solid-reach/utils';
import { DialogOverlay } from '@solid-reach/dialog';
import { splitProps, createMemo } from 'solid-js';
import { AlertDialogProps } from './types';
import { AlertDialogContext, AlertDialogContextValue } from './context';

export default function AlertDialogOverlay(props: AlertDialogProps) {
  const [local, others] = splitProps(props, [
    'leastDestructiveRef',
    'children',
    'ref',
  ]);
  const overlayRef: { current?: HTMLDivElement } = {};
  const id = createMemo(() => createId(props.id));
  const labelId = () => (id() ? `alert-dialog---${id()}` : undefined);
  const descriptionId = () =>
    id() ? `alert-description---${id()}` : undefined;

  const context: AlertDialogContextValue = {
    labelId,
    descriptionId,
    overlayRef: () => overlayRef.current,
    leastDestructiveRef: () => local.leastDestructiveRef?.(),
  };

  return (
    <AlertDialogContext.Provider value={context}>
      <DialogOverlay
        {...others}
        ref={composeRefs(overlayRef, props)}
        initialFocusRef={local.leastDestructiveRef}
      >
        {local.children}
      </DialogOverlay>
    </AlertDialogContext.Provider>
  );
}
