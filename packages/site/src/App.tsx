import type { Component } from 'solid-js';
import { onMount } from 'solid-js';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from '@solid-reach/accordion';
import { Tab, TabList, Tabs, TabPanel, TabPanels } from '@solid-reach/tabs';
import '@solid-reach/tabs/styles.css';

const App: Component = () => {
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
    </main>
  );
};

export default App;
