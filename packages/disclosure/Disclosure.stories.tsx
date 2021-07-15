import { Disclosure, DisclosureButton, DisclosurePanel } from './src';

export default {
  title: 'Disclosure',
};

const Template: any = (props: any) => {
  return (
    <Disclosure open={props.open} onChange={props.onChange}>
      <DisclosureButton>Find out what lies beneath</DisclosureButton>
      <DisclosurePanel>Here I am! I am the buried treasure!</DisclosurePanel>
    </Disclosure>
  );
};

export const Uncontrolled = Template.bind({});
Uncontrolled.args = {};

export const Controlled = Template.bind({});

Controlled.args = {
  open: false,
};

Controlled.argTypes = {
  open: { control: 'boolean' },
  onChange: { action: 'changed' },
};
