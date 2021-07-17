import { createId } from '@solid-reach/utils';
import { createSignal, JSX, mergeProps, createEffect } from 'solid-js';
import { DisclosureContextValue, DisclosureContext } from './context';
import warning from 'tiny-warning';

type DisclosureProps = {
  children: JSX.Element;
  defaultOpen?: boolean;
  onChange?(): void;
  open?: boolean;
  id?: string;
};

export default function Disclosure(props: DisclosureProps) {
  props = mergeProps({ defaultOpen: false }, props);
  const isControlled = () => props.open != null;
  const id = () => createId(props.id) || 'disclosure';
  const panelId = () => `panel---${id()}`;
  const [isOpen, setIsOpen] = createSignal(
    isControlled() ? (props.open as boolean) : (props.defaultOpen as boolean)
  );

  if (__DEV__) {
    const wasControlled = isControlled();
    createEffect(() => {
      warning(
        !(
          (isControlled() && !wasControlled) ||
          (!isControlled() && wasControlled)
        ),
        'Disclosure is changing from controlled to uncontrolled. Disclosure should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Disclosure for the lifetime of the component. Check the `open` prop being passed in.'
      );
    });
  }

  function onSelect() {
    props.onChange?.();
    if (!isControlled()) {
      setIsOpen((isOpen) => !isOpen);
    }
  }

  const context: DisclosureContextValue = {
    disclosureId: id,
    onSelect,
    open: isOpen,
    panelId,
  };

  if (isControlled() && props.open !== isOpen()) {
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
