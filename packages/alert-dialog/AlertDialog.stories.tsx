import { createSignal } from 'solid-js';
import { AlertDialog, AlertDialogLabel, AlertDialogDescription } from './src';
import '@solid-reach/dialog/styles.css';

export default {
  title: 'Alert Dialog',
  component: AlertDialog,
};
const Template: any = (props: any) => {
  const [showDialog, setShowDialog] = createSignal(false);
  let cancelRef: HTMLButtonElement | undefined;
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  return (
    <div>
      <button onClick={open}>Delete something</button>
      <AlertDialog isOpen={showDialog()} leastDestructiveRef={() => cancelRef}>
        <AlertDialogLabel>Please Confirm!</AlertDialogLabel>
        <AlertDialogDescription>
          Are you sure you want to delete something? This action is permanent,
          and we're totally not just flipping a field called "deleted" to "true"
          in our database, we're actually deleting something.
        </AlertDialogDescription>
        <div className="alert-buttons">
          <button onClick={close}>Yes, delete</button>
          <button ref={cancelRef} onClick={close}>
            Nevermind, don't delete.
          </button>
        </div>
      </AlertDialog>
    </div>
  );
};

export const Default = Template.bind({});

Default.parameters = {
  controls: { hideNoControlsWarning: true },
};
