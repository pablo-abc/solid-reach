import { Component, JSX } from 'solid-js';

export type DialogProps = {
  children: JSX.Element;
  ref?: HTMLElement | ((el: HTMLElement) => void) | undefined;
  as?: Component | string;
  isOpen?: boolean;
  initialFocusRef?: HTMLElement;
  onDismiss?(event?: Event): void;
};
