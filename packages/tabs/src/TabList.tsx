import { composeRefs } from '@solid-reach/utils';
import {
  Component,
  createRenderEffect,
  JSX,
  mergeProps,
  onMount,
  splitProps,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useTabsContext } from './context';

export type TabListProps = {
  as?: Component | string;
  children?: JSX.Element;
} & JSX.HTMLAttributes<HTMLDivElement>;

function boolOrBoolString(value: any): value is 'true' | true {
  return value === 'true' ? true : typeof value === 'boolean' ? value : false;
}

export default function TabList(props: TabListProps) {
  props = mergeProps({ as: 'div' }, props);
  const [local, others] = splitProps(props, [
    'children',
    'ref',
    'onKeyDown',
    'as',
  ]);

  const ownRef: { current?: HTMLDivElement } = {};

  const {
    focusedIndex,
    isControlled,
    isRTL,
    setIsRTL,
    keyboardActivation,
    onSelectTabWithKeyboard,
    orientation,
    selectedIndex,
    setSelectedIndex,
    descendants: tabs,
  } = useTabsContext();

  onMount(() => {
    if (
      ownRef.current &&
      ((ownRef.current.ownerDocument &&
        ownRef.current.ownerDocument.dir === 'rtl') ||
        getComputedStyle(ownRef.current).direction === 'rtl')
    ) {
      setIsRTL(true);
    }
  });

  function handleKeyDown(event: KeyboardEvent) {
    if (
      !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
    )
      return;
    event.preventDefault();
    const currentIndex =
      keyboardActivation() === 'manual' ? focusedIndex() : selectedIndex();
    const isHorizontal = orientation() === 'horizontal';
    const shouldInvert = isRTL() && isHorizontal;
    const keyNext = orientation() === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    const keyPrev = orientation() === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    let targetIndex: number;
    if (event.key === keyNext || (shouldInvert && event.key === keyPrev)) {
      targetIndex = currentIndex === tabs().length - 1 ? 0 : currentIndex + 1;
      while (tabs()[targetIndex].disabled) {
        targetIndex++;
        if (!tabs()[targetIndex]) targetIndex = 0;
      }
    } else if (
      event.key === keyPrev ||
      (shouldInvert && event.key === keyNext)
    ) {
      targetIndex = currentIndex === 0 ? tabs().length - 1 : currentIndex - 1;
      while (tabs()[targetIndex].disabled) {
        targetIndex--;
        if (!tabs()[targetIndex]) targetIndex = tabs().length - 1;
      }
    } else {
      return;
    }
    onSelectTabWithKeyboard(targetIndex);
  }

  createRenderEffect(() => {
    if (
      !isControlled() &&
      boolOrBoolString(tabs()[selectedIndex()]?.disabled)
    ) {
      const nextIndex = tabs().findIndex((tab) => !tab.disabled);
      if (nextIndex >= 0) setSelectedIndex(nextIndex);
    }
  });

  return (
    <Dynamic<TabListProps>
      role="tablist"
      aria-orientation={orientation()}
      {...others}
      component={local.as}
      data-reach-tab-list=""
      ref={composeRefs(ownRef, props)}
      onKeyDown={handleKeyDown}
    >
      {local.children}
    </Dynamic>
  );
}
