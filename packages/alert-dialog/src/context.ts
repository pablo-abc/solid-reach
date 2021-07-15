import { createContext, useContext, Accessor } from 'solid-js';

export type AlertDialogContextValue = {
  labelId: Accessor<string | undefined>;
  descriptionId: Accessor<string | undefined>;
  overlayRef: Accessor<HTMLDivElement | undefined>;
  leastDestructiveRef: Accessor<HTMLElement | undefined>;
};

export const AlertDialogContext = createContext({} as AlertDialogContextValue);

export function useAlertDialogContext() {
  return useContext(AlertDialogContext);
}
