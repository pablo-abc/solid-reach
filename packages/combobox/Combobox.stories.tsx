import { createSignal, Show } from 'solid-js';
import {
  Combobox,
  ComboboxList,
  ComboboxInput,
  ComboboxPopover,
  ComboboxOption,
} from './src';
import './styles.css';

export default {
  title: 'Combobox',
};

const Template: any = () => {
  const [show, setShow] = createSignal(false);
  setTimeout(() => setShow(true));
  return (
    <Show when={show()}>
      <Combobox aria-label="choose a fruit">
        <ComboboxInput />
        <ComboboxPopover>
          <ComboboxList>
            <ComboboxOption value="Apple" />
            <ComboboxOption value="Banana" />
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </Show>
  );
};

export const Basic = Template.bind({});
