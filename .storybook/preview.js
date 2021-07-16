import { createRoot } from 'solid-js';

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
    createRoot(() => (
      <div>
        <Story />
      </div>
    )),
];
