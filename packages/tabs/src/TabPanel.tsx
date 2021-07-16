import { composeRefs } from '@solid-reach/utils';
import { Component, createMemo, JSX, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useTabPanelsContext, useTabsContext } from './context';

export type TabPanelProps = {
  as?: Component | string;
  children?: JSX.Element;
} & JSX.HTMLAttributes<HTMLDivElement>;

export default function TabPanel(props: TabPanelProps) {
  props = mergeProps({ as: 'div' }, props);
  const [local, others] = splitProps(props, [
    'as',
    'ref',
    'children',
    'aria-label',
  ]);
  const ownRef: { current?: HTMLDivElement } = {};
  const { selectedPanelRef, selectedIndex, id: tabsId } = useTabsContext();
  const { descendants: tabPanels } = useTabPanelsContext();
  const index = createMemo(() =>
    tabPanels().findIndex((panel) => panel === ownRef.current)
  );
  const id = () => `${tabsId()}---panel---${index()}`;
  const isSelected = () => index() === selectedIndex();

  return (
    <Dynamic<TabPanelProps>
      aria-labelledby={`${tabsId()}---tab---${index()}`}
      hidden={!isSelected()}
      role="tabpanel"
      tabindex={isSelected() ? 0 : -1}
      {...others}
      component={local.as}
      ref={composeRefs(ownRef, props, {
        ref: (r) => {
          if (isSelected()) selectedPanelRef.current = r;
        },
      })}
      data-reach-tab-panel=""
      id={id()}
    >
      {local.children}
    </Dynamic>
  );
}
