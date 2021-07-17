import { JSX, Component } from 'solid-js';

export type PossibleNode = null | undefined | HTMLElement | SVGElement;

export type PRect = Partial<DOMRect> & {
  readonly bottom: number;
  readonly height: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly width: number;
};

export type Position = (
  targetRect?: PRect | null,
  popoverRect?: PRect | null
) => JSX.CSSProperties;

export type PopoverProps = {
  as?: Component | string;
  children: JSX.Element;
  targetRef: PossibleNode;
  position?: Position;
  hidden?: boolean;
} & JSX.HTMLAttributes<HTMLDivElement>;
