import { JSX, splitProps, Show } from 'solid-js';
import TooltipContent, { TooltipContentProps } from './TooltipContent';
import Portal from '@solid-reach/portal';

export type TooltipPopupProps = TooltipContentProps & {
  children?: JSX.Element;
};

export default function TooltipPopup(props: TooltipPopupProps) {
  const [local, others] = splitProps(props, [
    'children',
    'label',
    'isVisible',
    'id',
    'ref',
  ]);

  return (
    <Show when={local.isVisible}>
      <Portal>
        <TooltipContent
          ref={props.ref}
          label={local.label}
          isVisible={local.isVisible}
          {...others}
          id={`tooltip---${local.id}`}
        >
          {local.children}
        </TooltipContent>
      </Portal>
    </Show>
  );
}
