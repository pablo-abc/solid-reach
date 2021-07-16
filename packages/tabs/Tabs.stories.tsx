import { Tabs, Tab, TabList, TabPanels, TabPanel } from './src';
import './styles.css';

export default {
  title: 'Tabs',
  argTypes: {
    orientation: {
      options: ['horizontal', 'vertical'],
      control: 'select',
    },
  },
};

const Template: any = (props: any) => {
  function onChange(index: number) {
    if (!props.onChange) return;
    props.onChange(`Called with index: ${index}`);
  }
  return (
    <Tabs {...props} onChange={onChange}>
      <TabList>
        <Tab>One</Tab> <Tab>Two</Tab> <Tab>Three</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <p>one!</p>
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
        <TabPanel>
          <p>three!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export const Uncontrolled = Template.bind({});

Uncontrolled.argTypes = {
  keyboardActivation: {
    options: ['auto', 'manual'],
    control: 'select',
  },
  defaultIndex: {
    control: { type: 'number', min: 0, max: 2 },
  },
};

Uncontrolled.args = {
  orientation: 'horizontal',
  keyboardActivation: 'auto',
  defaultIndex: 0,
};

export const Controlled = Template.bind({});

Controlled.argTypes = {
  index: {
    control: { type: 'number', min: 0, max: 2 },
  },
  onChange: {
    action: 'changed',
  },
};

Controlled.args = {
  index: 0,
  orientation: 'horizontal',
};
