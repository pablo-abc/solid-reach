import { onCleanup } from 'solid-js';
import { useFocusOn } from 'svelte-focus-on';

export function focusOn(el: HTMLElement) {
  const focus = useFocusOn();
  const { destroy } = focus(el);
  onCleanup(destroy);
}
