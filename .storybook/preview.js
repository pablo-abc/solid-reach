import { createRoot, createSignal, Show } from 'solid-js';

window.__DEV__ = true;

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) =>
    createRoot(() => {
      const [show, setShow] = createSignal(false);
      setTimeout(() => setShow(true));
      return (
        <div>
          <Show when={show()}>
            <Story />
          </Show>
        </div>
      );
    }),
];
