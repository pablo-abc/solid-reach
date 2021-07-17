import Alert from './src';

export default {
  title: 'Alert',
  argTypes: {
    type: {
      options: ['assertive', 'polite'],
      control: 'radio',
    },
  },
};

const Template: any = (props: any) => {
  return <Alert type={props.type}>{props.children}</Alert>;
};

export const Default = Template.bind({});

Default.args = {
  type: 'polite',
  children: 'This is an alert',
};
