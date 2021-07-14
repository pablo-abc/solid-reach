import { composeRefs, createId, noop } from '@solid-reach/utils';
import {
  Component,
  JSX,
  mergeProps,
  createSignal,
  createMemo,
  Accessor,
  splitProps,
  onMount,
  onCleanup,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { InternalAccordionContextValue, AccordionContext } from './context';

type AccordionIndex = number | number[];

export type AccordionProps = {
  id?: string;
  as?: Component | string;
  children?: JSX.Element;
  defaultIndex?: AccordionIndex;
  index?: AccordionIndex;
  readOnly?: boolean;
  collapsible?: boolean;
  multiple?: boolean;
  onChange?(index?: number): void;
  ref?: ((ref: HTMLElement) => any) | HTMLElement;
} & JSX.HTMLAttributes<HTMLElement>;

export default function Accordion(props: AccordionProps) {
  props = mergeProps(
    { as: 'div', readOnly: false, collapsible: false, multiple: false },
    props
  );
  const [local, others] = splitProps(props, ['as', 'ref', 'children']);
  const isControlled = typeof props.index !== 'undefined';
  const controlledIndex = createMemo(() => props.index);
  const accordionRef: { current?: HTMLElement } = {};
  const id = createId(props.id);
  function getDefaultOpen() {
    switch (true) {
      case isControlled:
        return controlledIndex!;

      // If we have a defaultIndex, we need to do a few checks
      case props.defaultIndex != null:
        /*
         * If multiple is set to true, we need to make sure the `defaultIndex`
         * is an array (and vice versa). We'll handle console warnings in
         * our propTypes, but this will at least keep the component from
         * blowing up.
         */
        if (props.multiple) {
          return Array.isArray(props.defaultIndex)
            ? props.defaultIndex
            : [props.defaultIndex!];
        } else {
          return Array.isArray(props.defaultIndex)
            ? props.defaultIndex[0] ?? 0
            : props.defaultIndex!;
        }

      /*
       * Collapsible accordions with no defaultIndex will start with all
       * panels collapsed. Otherwise the first panel will be our default.
       */
      case props.collapsible:
        return props.multiple ? [] : -1;
      default:
        return props.multiple ? [0] : 0;
    }
  }
  const [openPanels, setOpenPanels] = createSignal<AccordionIndex>(
    getDefaultOpen() as AccordionIndex
  );
  function onSelectPanel(index: number) {
    props.onChange && props.onChange(index);

    if (!isControlled) {
      setOpenPanels((prevOpenPanels) => {
        /*
         * If we're dealing with an uncontrolled component, the index arg
         * in selectChange will always be a number rather than an array.
         */
        index = index as number;
        // multiple allowed
        if (props.multiple) {
          // state will always be an array here
          prevOpenPanels = prevOpenPanels as number[];
          if (
            // User is clicking on an already-open button
            prevOpenPanels.includes(index as number)
          ) {
            // Other panels are open OR accordion is allowed to collapse
            if (prevOpenPanels.length > 1 || props.collapsible) {
              // Close the panel by filtering it from the array
              return prevOpenPanels.filter((i) => i !== index);
            }
          } else {
            // Open the panel by adding it to the array.
            return [...prevOpenPanels, index].sort();
          }
        } else {
          prevOpenPanels = prevOpenPanels as number;
          return prevOpenPanels === index && props.collapsible ? -1 : index;
        }
        return prevOpenPanels;
      });
    }
  }
  const [descendants, setDescendants] = createSignal<HTMLElement[]>([]);

  const context: InternalAccordionContextValue = {
    accordionId: id,
    openPanels: isControlled
      ? (controlledIndex as Accessor<AccordionIndex>)
      : openPanels,
    onSelectPanel: props.readOnly ? noop : onSelectPanel,
    readOnly: createMemo(() => props.readOnly!),
    descendants,
  };

  onMount(() => {
    function mutate(mutationList: MutationRecord[]) {
      if (!accordionRef.current) return;
      for (const mutation of mutationList) {
        if (mutation.type !== 'childList') continue;
        const items = accordionRef.current.querySelectorAll(
          '[data-reach-accordion-item=""]'
        );
        setDescendants(Array.from(items) as HTMLElement[]);
      }
    }
    if (!accordionRef.current) return;
    const items = accordionRef.current.querySelectorAll(
      '[data-reach-accordion-item=""]'
    );
    setDescendants(Array.from(items) as HTMLElement[]);

    const observer = new MutationObserver(mutate);
    observer.observe(accordionRef.current, { childList: true, subtree: true });
    onCleanup(() => observer.disconnect());
  });
  return (
    <AccordionContext.Provider value={context}>
      <Dynamic<JSX.HTMLAttributes<HTMLElement>>
        {...others}
        ref={composeRefs<HTMLElement>(accordionRef, props)}
        data-reach-accordion=""
        component={local.as}
      >
        {local.children}
      </Dynamic>
    </AccordionContext.Provider>
  );
}
