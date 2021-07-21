import type { Component } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import {
  Combobox,
  ComboboxList,
  ComboboxInput,
  ComboboxPopover,
  ComboboxOption,
} from '@solid-reach/combobox';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from '@solid-reach/accordion';
import { Tab, TabList, Tabs, TabPanel, TabPanels } from '@solid-reach/tabs';
import { Dialog } from '@solid-reach/dialog';
import VisuallyHidden from '@solid-reach/visually-hidden';
import Tooltip from '@solid-reach/tooltip';
import '@solid-reach/dialog/styles.css';
import '@solid-reach/tabs/styles.css';
import '@solid-reach/combobox/styles.css';
import '@solid-reach/accordion/styles.css';
import '@solid-reach/tooltip/styles.css';

const App: Component = () => {
  const [show, setShow] = createSignal(false);
  const [value, setValue] = createSignal('');
  const open = () => setShow(true);
  const close = () => setShow(false);

  createEffect(() => console.log(value()));

  return (
    <main>
      <Accordion>
        <AccordionItem>
          <AccordionButton>1</AccordionButton>
          <AccordionPanel>Hidden 1</AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>2</AccordionButton>
          <AccordionPanel>Hidden 2</AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>3</AccordionButton>
          <AccordionPanel>Hidden 3</AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Tabs orientation="horizontal">
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
      <button type="button" onClick={() => setValue('apple')}>
        Set
      </button>
      <Combobox
        style={{ 'margin-bottom': '50px' }}
        aria-label="choose a fruit"
        onSelect={setValue}
      >
        <ComboboxInput
          value={value()}
          onInput={(e) => setValue(e.currentTarget.value)}
        />
        <ComboboxPopover>
          <ComboboxList>
            <ComboboxOption value="Apple" />
            <ComboboxOption value="Banana" />
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
      <button onClick={open}>Open Dialog</button>
      <Dialog isOpen={show()} onDismiss={close}>
        <button onClick={close}>
          <VisuallyHidden>Close</VisuallyHidden> <span aria-hidden>×</span>
        </button>
        <p>Hello there. I am a dialog</p>
      </Dialog>
      <Tooltip label="Hi hi hi">
        {(trigger) => <button {...trigger}>Hover me</button>}
      </Tooltip>
    </main>
  );
};

export default App;
