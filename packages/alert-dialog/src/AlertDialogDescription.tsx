import { Dynamic } from 'solid-js/web';
import { Component, JSX, splitProps, mergeProps } from 'solid-js';
import { useAlertDialogContext } from './context';

export type AlertDialogDescriptionProps = {
  as?: Component | string;
  ref?: HTMLDivElement | ((el: HTMLDivElement) => void);
} & JSX.HTMLAttributes<HTMLDivElement>;

export default function AlertDialogDescription(
  props: AlertDialogDescriptionProps
) {
  props = mergeProps({ as: 'div' }, props);
  const [local, others] = splitProps(props, ['as', 'children', 'ref']);
  const { descriptionId } = useAlertDialogContext();

  return (
    <Dynamic<JSX.HTMLAttributes<HTMLDivElement>>
      {...others}
      component={local.as}
      ref={props.ref}
      id={descriptionId()}
      data-reach-alert-dialog-description=""
    >
      {local.children}
    </Dynamic>
  );
}
