import { createContext, useContext, Accessor } from 'solid-js';

export type InternalTabsContextValue = {
  focusedIndex: Accessor<number>;
  id: Accessor<string>;
  isControlled: Accessor<boolean>;
  isRTL: Accessor<boolean>;
  setIsRTL(value: boolean): void;
  keyboardActivation: Accessor<'auto' | 'manual'>;
  onFocusPanel(): void;
  onSelectTab(index: number): void;
  onSelectTabWithKeyboard(index: number): void;
  orientation: Accessor<'horizontal' | 'vertical'>;
  selectedIndex: Accessor<number>;
  selectedPanelRef: { current?: HTMLElement };
  setFocusedIndex(index: number): void;
  setSelectedIndex(index: number): void;
  userInteractedRef: { current: boolean };
  descendants: Accessor<HTMLButtonElement[]>;
};

export const TabsContext = createContext({} as InternalTabsContextValue);

export function useTabsContext() {
  return useContext(TabsContext);
}

export type InternalTabPanelsContextValue = {
  descendants: Accessor<HTMLElement[]>;
};

export const TabPanelsContext = createContext(
  {} as InternalTabPanelsContextValue
);

export function useTabPanelsContext() {
  return useContext(TabPanelsContext);
}
