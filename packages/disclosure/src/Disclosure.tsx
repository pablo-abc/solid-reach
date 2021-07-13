import { createId } from '@solid-reach/utils';
import { createSignal, JSX, mergeProps } from 'solid-js';
import { DisclosureContextValue, DisclosureContext } from './context';

type DisclosureProps = {
  children: JSX.Element;
  defaultOpen?: boolean;
  onChange?(): void;
  open?: boolean;
  id?: string;
};

export default function Disclosure(props: DisclosureProps) {
  props = mergeProps({ defaultOpen: false }, props);
  const wasControlled = props.open != null;
  let isControlled = wasControlled;
  const id = createId(props.id) || 'disclosure';
  const panelId = `panel---${id}`;
  const [isOpen, setIsOpen] = createSignal(
    isControlled ? (props.open as boolean) : (props.defaultOpen as boolean)
  );

  function onSelect() {
    props.onChange?.();
    if (!isControlled) {
      setIsOpen((isOpen) => !isOpen);
    }
  }

  const context: DisclosureContextValue = {
    disclosureId: id,
    onSelect,
    open: isOpen,
    panelId,
  };

  if (isControlled && props.open !== isOpen()) {
    /*
     * If the component is controlled, we'll sync internal state with the
     * controlled state
     */
    setIsOpen(props.open as boolean);
  }

  return (
    <DisclosureContext.Provider value={context}>
      {props.children}
    </DisclosureContext.Provider>
  );
}
