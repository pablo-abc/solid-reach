import { JSX, mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { composeEventHandler } from '@solid-reach/utils';
import { DialogContentProps } from './types';

export default function DialogContent(props: DialogContentProps) {
  props = mergeProps({ as: 'div' }, props);
  const [local, others] = splitProps(props, [
    'as',
    'onClick',
    'onKeyDown',
    'children',
    'ref',
  ]);

  const handleClick = composeEventHandler(
    local.onClick as any,
    (event: Event) => {
      event.stopPropagation();
    }
  );
  return (
    <Dynamic<JSX.HTMLAttributes<HTMLDivElement>>
      aria-modal="true"
      role="dialog"
      tabindex={-1}
      {...others}
      component={local.as}
      ref={props.ref}
      data-reach-dialog-content=""
      onClick={handleClick}
    >
      {local.children}
    </Dynamic>
  );
}
