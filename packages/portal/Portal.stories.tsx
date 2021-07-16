import Portal from './src';
import { createSignal, Show, onMount } from 'solid-js';

export default {
  title: 'Portal',
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};

export const Default: any = () => {
  const [show, setShow] = createSignal(false);
  onMount(() => setTimeout(() => setShow(true)));
  return (
    <div
      style={{
        height: '50px',
        overflow: 'auto',
        'margin-right': '250px',
        'max-width': '400px',
      }}
    >
      <div
        style={{
          border: 'solid 5px',
          padding: '20px',
        }}
      >
        This is the React Root where the portal is rendered. You can see it has
        clipped overflow, but the portal's styles are just fine.
      </div>
      <Show when={show()}>
        <Portal>
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '200px',
              border: 'solid 1px hsla(0, 0%, 0%, 0.25)',
              'box-shadow': '0px 2px 10px hsla(0, 0%, 0%, 0.25)',
              padding: '20px',
              background: '#f0f0f0',
              'text-align': 'center',
            }}
          >
            This is in the portal
          </div>
        </Portal>
      </Show>
    </div>
  );
};
