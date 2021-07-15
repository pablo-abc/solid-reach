import { splitProps } from 'solid-js';
import AlertDialogContent from './AlertDialogContent';
import AlertDialogOverlay from './AlertDialogOverlay';
import { AlertDialogProps } from './types';

export default function AlertDialog(props: AlertDialogProps) {
  const [local, others] = splitProps(props, [
    'id',
    'isOpen',
    'onDismiss',
    'leastDestructiveRef',
  ]);

  return (
    <AlertDialogOverlay {...local}>
      <AlertDialogContent {...others} ref={props.ref} />
    </AlertDialogOverlay>
  );
}
