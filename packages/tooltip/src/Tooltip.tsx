import { JSX, splitProps } from 'solid-js';
import { useTooltip, TriggerParams } from './hook';
import { TooltipContentProps } from './TooltipContent';
import TooltipPopup from './TooltipPopup';

export type TooltipProps = Omit<
  TooltipContentProps,
  'triggerRect' | 'isVisible' | 'children'
> & {
  children: (props: TriggerParams<HTMLElement>) => JSX.Element;
  DEBUG_STYLE?: boolean;
};

export default function Tooltip(props: TooltipProps) {
  const [local, others] = splitProps(props, [
    'children',
    'ref',
    'label',
    'id',
    'DEBUG_STYLE',
  ]);

  const [trigger, tooltip] = useTooltip({
    DEBUG_STYLE: local.DEBUG_STYLE,
    id: () => local.id,
  });

  return (
    <>
      {local.children(trigger)}
      <TooltipPopup
        ref={props.ref}
        label={local.label}
        {...tooltip}
        {...others}
      />
    </>
  );
}
