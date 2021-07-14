import type { Component } from 'solid-js';
import { onMount } from 'solid-js';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from '@solid-reach/accordion';

const App: Component = () => {
  return (
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
  );
};

export default App;
