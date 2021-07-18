import { splitProps } from 'solid-js';
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
  argTypes: {
    openOnFocus: {
      control: 'boolean',
    },
    selectOnClick: { control: 'boolean' },
    autocomplete: { control: 'boolean' },
    persistSelection: { control: 'boolean' },
    onSelect: { action: 'select' },
  },
};

const Template: any = (props: any) => {
  const [combobox] = splitProps(props, ['openOnFocus', 'onSelect']);
  const [input] = splitProps(props, ['selectOnClick', 'autocomplete']);
  return (
    <>
      <label id="fruit-label">Choose a fruit:</label>
      <Combobox aria-labelledby="fruit-label" {...combobox}>
        <ComboboxInput {...input} />
        <ComboboxPopover portal={props.portal}>
          <ComboboxList persistSelection={props.persistSelection}>
            <ComboboxOption value="Apple" />
            <ComboboxOption value="Banana" />
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </>
  );
};

export const Basic = Template.bind({});

Basic.args = {
  openOnFocus: false,
  selectOnClick: false,
  autocomplete: true,
  persistSelection: false,
};
