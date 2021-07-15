import { createSignal } from 'solid-js';
import { Dialog } from './src';
import VisuallyHidden from '@solid-reach/visually-hidden';
import './styles.css';

export default {
  title: 'Dialog (Modal)',
};

const Template: any = (props: any) => {
  const [showDialog, setShowDialog] = createSignal(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  return (
    <div>
      <button onClick={open}>Open Dialog</button>
      <Dialog isOpen={showDialog()} onDismiss={close}>
        <button onClick={close}>
          <VisuallyHidden>Close</VisuallyHidden> <span aria-hidden>×</span>
        </button>
        <p>Hello there. I am a dialog</p>
      </Dialog>
    </div>
  );
};

export const Default = Template.bind({});

Default.parameters = {
  controls: { hideNoControlsWarning: true },
};
