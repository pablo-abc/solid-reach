import { createSignal, onCleanup, Accessor, createEffect } from 'solid-js';

export function createDescendants<El extends HTMLElement = HTMLElement>(
  node: Accessor<HTMLElement | undefined>,
  descendantSelector: string
) {
  const [descendants, setDescendants] = createSignal<El[]>([]);

  createEffect(() => {
    const currentNode = node();
    if (!currentNode) return;
    function mutate(mutationList: MutationRecord[]) {
      if (!currentNode) return;
      for (const mutation of mutationList) {
        if (mutation.type !== 'childList') continue;
        const items = currentNode.querySelectorAll(descendantSelector);
        setDescendants(Array.from(items) as El[]);
      }
    }
    if (!currentNode) return;
    const items = currentNode.querySelectorAll(descendantSelector);
    setDescendants(Array.from(items) as El[]);

    const observer = new MutationObserver(mutate);
    observer.observe(currentNode, { childList: true, subtree: true });
    onCleanup(() => observer.disconnect());
  });

  return descendants;
}
