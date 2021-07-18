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
  return (
    <Combobox aria-label="choose a fruit">
      <ComboboxInput />
      <ComboboxPopover>
        <ComboboxList>
          <ComboboxOption value="Apple" />
          <ComboboxOption value="Banana" />
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export const Basic = Template.bind({});
