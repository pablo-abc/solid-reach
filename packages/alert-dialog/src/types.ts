import { JSX, Accessor } from 'solid-js';
import { DialogProps, DialogContentProps } from '@solid-reach/dialog';

export type AlertDialogProps = {
  id?: string;
  isOpen?: boolean;
  onDismiss?(event?: Event): void;
  leastDestructiveRef?: Accessor<HTMLElement>;
  children: JSX.Element;
} & DialogProps;

export type AlertDialogContentProps = {
  children: JSX.Element;
} & DialogContentProps;
