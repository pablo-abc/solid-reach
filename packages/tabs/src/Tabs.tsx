import { composeRefs, createDescendants, createId } from '@solid-reach/utils';
import {
  Component,
  createMemo,
  createSignal,
  JSX,
  mergeProps,
  splitProps,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { InternalTabsContextValue, TabsContext } from './context';

export type TabsProps = {
  as?: Component | string;
  children: JSX.Element;
  defaultIndex?: number;
  index?: number;
  keyboardActivation?: 'manual' | 'auto';
  readOnly?: boolean;
  orientation?: 'vertical' | 'horizontal';
  onChange?(index?: number): void;
  ref?: ((ref: HTMLElement) => any) | HTMLElement;
} & Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'>;

export default function Tabs(props: TabsProps) {
  props = mergeProps(
    {
      as: 'div',
      readOnly: false,
      orientation: 'horizontal',
      keyboardActivation: 'auto',
    },
    props
  );
  const [local, others] = splitProps(props, [
    'as',
    'ref',
    'children',
    'defaultIndex',
    'orientation',
    'index',
    'keyboardActivation',
    'onChange',
    'readOnly',
  ]);
  const isControlled = props.index != null;
  const controlledIndex = createMemo(() => props.index);

  const id = createMemo(() => createId(props.id));

  const tabsRef: { current?: HTMLElement } = {};
  const userInteractedRef: { current: boolean } = { current: false };
  const selectedPanelRef: { current?: HTMLElement } = {};
  const [isRTL, setIsRTL] = createSignal(false);

  const [selectedIndex, setSelectedIndex] = createSignal(
    isControlled ? controlledIndex()! : local.defaultIndex ?? 0
  );
  const [focusedIndex, setFocusedIndex] = createSignal(-1);

  const descendants = createDescendants<HTMLButtonElement>(
    () => tabsRef.current,
    '[data-reach-tab=""]'
  );

  const context: InternalTabsContextValue = {
    focusedIndex,
    id,
    isControlled: () => isControlled,
    isRTL,
    setIsRTL,
    keyboardActivation: () => local.keyboardActivation!,
    onFocusPanel() {
      if (typeof selectedPanelRef.current?.focus === 'function') {
        selectedPanelRef.current.focus();
      }
    },
    onSelectTab(index: number) {
      if (local.readOnly) return;
      userInteractedRef.current = true;
      local.onChange?.(index);
      !isControlled && setSelectedIndex(index);
    },
    onSelectTabWithKeyboard(index: number) {
      if (local.readOnly) return;
      userInteractedRef.current = true;
      const tabElement = descendants()[index];
      switch (local.keyboardActivation) {
        case 'manual': {
          tabElement?.focus();
          return;
        }
        case 'auto':
        default: {
          local.onChange?.(index);
          !isControlled && setSelectedIndex(index);
          return;
        }
      }
    },
    orientation: () => local.orientation!,
    selectedIndex,
    selectedPanelRef,
    setFocusedIndex,
    setSelectedIndex,
    userInteractedRef,
    descendants,
  };

  return (
    <TabsContext.Provider value={context}>
      <Dynamic<TabsProps>
        {...others}
        id={props.id}
        ref={composeRefs<HTMLElement>(tabsRef, props)}
        data-reach-tabs=""
        data-orientation={local.orientation}
        component={local.as}
      >
        {local.children}
      </Dynamic>
    </TabsContext.Provider>
  );
}
