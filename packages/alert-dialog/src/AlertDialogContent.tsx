import { splitProps } from 'solid-js';
import { DialogContent } from '@solid-reach/dialog';
import { useAlertDialogContext } from './context';
import { AlertDialogContentProps } from './types';

export default function AlertDialogContent(props: AlertDialogContentProps) {
  const [local, others] = splitProps(props, ['children', 'ref']);
  const { descriptionId, labelId } = useAlertDialogContext();

  return (
    <DialogContent
      role="alertdialog"
      aria-describedby={descriptionId()}
      aria-labelledby={props['aria-label'] ? undefined : labelId()}
      {...others}
      ref={props.ref}
      data-reach-alert-dialog-content=""
    >
      {local.children}
    </DialogContent>
  );
}
