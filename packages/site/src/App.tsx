import type { Component } from 'solid-js';
import { onMount } from 'solid-js';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@solid-reach/disclosure';
import VisuallyHidden from '@solid-reach/visually-hidden';

const App: Component = () => {
  let div: any;
  onMount(() => {
    console.log('iv', div);
  });
  return (
    <>
      <Disclosure>
        <DisclosureButton>
          Hello <VisuallyHidden>From the depths</VisuallyHidden>
        </DisclosureButton>
        <DisclosurePanel>I was hidden but I am not anymore</DisclosurePanel>
      </Disclosure>
      <Disclosure>
        <DisclosureButton>
          Hello <VisuallyHidden>From the depths</VisuallyHidden>
        </DisclosureButton>
        <DisclosurePanel ref={div}>
          I was hidden but I am not anymore
        </DisclosurePanel>
      </Disclosure>
    </>
  );
};

export default App;
