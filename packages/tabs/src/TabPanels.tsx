import { composeRefs } from '@solid-reach/utils';
import {
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
  splitProps,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { TabPanelsContext } from './context';
import { TabListProps } from './TabList';

export type TabPanelsProps = TabListProps;

export default function TabPanels(props: TabPanelsProps) {
  props = mergeProps({ as: 'div' }, props);
  const [local, others] = splitProps(props, ['children', 'ref', 'as']);

  const ownRef: { current?: HTMLDivElement } = {};
  const [tabPanels, setTabPanels] = createSignal<HTMLDivElement[]>([]);

  const context = { descendants: tabPanels };

  onMount(() => {
    function mutate(mutationList: MutationRecord[]) {
      if (!ownRef.current) return;
      for (const mutation of mutationList) {
        if (mutation.type !== 'childList') continue;
        const items = ownRef.current.querySelectorAll(
          '[data-reach-tab-panel=""]'
        );
        setTabPanels(Array.from(items) as HTMLDivElement[]);
      }
    }
    if (!ownRef.current) return;
    const items = ownRef.current.querySelectorAll('[data-reach-tab-panel=""]');
    setTabPanels(Array.from(items) as HTMLDivElement[]);

    const observer = new MutationObserver(mutate);
    observer.observe(ownRef.current, { childList: true, subtree: true });
    onCleanup(() => observer.disconnect());
  });

  return (
    <TabPanelsContext.Provider value={context}>
      <Dynamic<TabPanelsProps>
        {...others}
        component={local.as}
        ref={composeRefs(ownRef, props)}
        data-reach-tab-panels=""
      >
        {local.children}
      </Dynamic>
    </TabPanelsContext.Provider>
  );
}
