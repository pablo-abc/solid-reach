import { createContext, useContext, Accessor } from 'solid-js';

type AccordionIndex = number | number[];
export type InternalAccordionContextValue = {
  accordionId: Accessor<string | undefined>;
  openPanels: Accessor<AccordionIndex>;
  onSelectPanel(index: AccordionIndex): void;
  readOnly: Accessor<boolean>;
  descendants: Accessor<HTMLElement[]>;
};

export const AccordionContext = createContext(
  {} as InternalAccordionContextValue
);

export function useAccordionContext() {
  return useContext(AccordionContext);
}

export type InternalAccordionItemContextValue = {
  disabled: Accessor<boolean>;
  buttonId: Accessor<string | undefined>;
  index: Accessor<number | undefined>;
  itemId: Accessor<string | undefined>;
  buttonRef: { current?: HTMLButtonElement };
  panelId: Accessor<string | undefined>;
  state: Accessor<'open' | 'collapsed'>;
};

export const AccordionItemContext = createContext(
  {} as InternalAccordionItemContextValue
);

export function useAccordionItemContext() {
  return useContext(AccordionItemContext);
}
