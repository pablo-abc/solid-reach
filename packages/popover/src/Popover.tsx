import Portal from '@solid-reach/portal';
import { PopoverProps } from './types';
import PopoverImpl from './PopoverImpl';

export default function Popover(props: PopoverProps) {
  return (
    <Portal>
      <PopoverImpl {...props}>{props.children}</PopoverImpl>
    </Portal>
  );
}
