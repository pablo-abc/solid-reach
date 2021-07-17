import { splitProps, createSignal, createEffect } from 'solid-js';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from './src';
import './styles.css';

export default {
  title: 'Accordion',
  argTypes: {
    readOnly: { control: 'boolean' },
    disable: {
      options: ['Step 1', 'Step 2'],
      control: 'inline-check',
    },
    onChange: { action: 'changed' },
  },
};

const Template: any = (props: any) => {
  const [local, others] = splitProps(props, ['disable', 'index', 'onChange']);
  const [index, setIndex] = createSignal<number | number[]>(local.index);

  createEffect(() => {
    local.index && setIndex(local.index);
  });

  return (
    <Accordion
      {...others}
      index={index()}
      onChange={(value: number) => {
        local.onChange(`Selected index: ${value}`);
      }}
    >
      <AccordionItem disabled={local.disable?.includes('Step 1')}>
        <h3>
          <AccordionButton>Step 1: Do a thing</AccordionButton>
        </h3>
        <AccordionPanel>
          Here are some detailed instructions about doing a thing. I am very
          complex and probably contain a lot of content, so a user can hide or
          show me by clicking the button above.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem disabled={local.disable?.includes('Step 2')}>
        <h3>
          <AccordionButton>Step 2: Do another thing</AccordionButton>
        </h3>
        <AccordionPanel>
          Here are some detailed instructions about doing yet another thing.
          There are a lot of things someone might want to do, so I am only going
          to talk about doing that other thing. I'll let my fellow accordion
          items go into detail about even more things.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export const Uncontrolled = Template.bind({});

Uncontrolled.argTypes = {
  collapsible: {
    control: 'boolean',
  },
  multiple: { control: 'boolean' },
};

export const Controlled = Template.bind({});

Controlled.args = {
  index: [0],
};

Controlled.argTypes = {
  index: {
    options: [0, 1],
    control: 'inline-check',
  },
};
