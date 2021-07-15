import { Dynamic } from 'solid-js/web';
import { Component, JSX, splitProps, mergeProps } from 'solid-js';
import { useAlertDialogContext } from './context';

export type AlertDialogLabelProps = {
  as?: Component | string;
  ref?: HTMLDivElement | ((el: HTMLDivElement) => void);
} & JSX.HTMLAttributes<HTMLDivElement>;

export default function AlertDialogLabel(props: AlertDialogLabelProps) {
  props = mergeProps({ as: 'div' }, props);
  const [local, others] = splitProps(props, ['as', 'children', 'ref']);
  const { labelId } = useAlertDialogContext();

  return (
    <Dynamic<JSX.HTMLAttributes<HTMLDivElement>>
      {...others}
      component={local.as}
      ref={props.ref}
      id={labelId()}
      data-reach-alert-dialog-label=""
    >
      {local.children}
    </Dynamic>
  );
}
