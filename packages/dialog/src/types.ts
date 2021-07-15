import { Component, JSX, Accessor } from 'solid-js';

export type DialogProps = {
  children: JSX.Element;
  ref?: HTMLDivElement | ((el: HTMLDivElement) => void);
  as?: Component | string;
  isOpen?: boolean;
  initialFocusRef?: Accessor<HTMLElement>;
  onDismiss?(event?: Event): void;
} & JSX.HTMLAttributes<HTMLDivElement>;

export type DialogContentProps = DialogProps;
