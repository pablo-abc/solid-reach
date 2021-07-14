import { createContext, useContext, Accessor } from 'solid-js';

export type DisclosureContextValue = {
  disclosureId: Accessor<string>;
  onSelect(): void;
  open: Accessor<boolean>;
  panelId: Accessor<string>;
};

export const DisclosureContext = createContext({} as DisclosureContextValue);

export function useDisclosureContext() {
  return useContext(DisclosureContext);
}
