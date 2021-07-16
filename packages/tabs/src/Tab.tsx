import { composeEventHandler, composeRefs } from '@solid-reach/utils';
import {
  Component,
  JSX,
  mergeProps,
  splitProps,
  createMemo,
  createEffect,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useTabsContext } from './context';

export type TabProps = {
  as?: Component | string;
  children?: JSX.Element;
  disabled?: boolean;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Tab(props: TabProps) {
  props = mergeProps({ as: 'button' }, props);
  const [local, others] = splitProps(props, [
    'ref',
    'as',
    'children',
    'disabled',
    'onBlur',
    'onFocus',
  ]);

  const {
    id: tabsId,
    onSelectTab,
    orientation,
    selectedIndex,
    userInteractedRef,
    setFocusedIndex,
    descendants: tabs,
  } = useTabsContext();

  const ownRef: { current?: HTMLButtonElement } = {};
  const index = createMemo(() =>
    tabs().findIndex((tab) => tab === ownRef.current)
  );
  const htmlType = () =>
    local.as === 'button' && props.type == null ? 'button' : props.type;

  const isSelected = () => index() === selectedIndex();

  function onSelect() {
    onSelectTab(index());
  }

  createEffect(() => {
    if (isSelected() && ownRef.current && userInteractedRef.current) {
      userInteractedRef.current = false;
      if (typeof ownRef.current?.focus === 'function') {
        ownRef.current.focus();
      }
    }
  });

  return (
    <Dynamic<TabProps>
      aria-controls={`${tabsId()}---panel---${index()}`}
      aria-disabled={local.disabled}
      aria-selected={isSelected()}
      role="tab"
      tabindex={isSelected() ? 0 : -1}
      {...others}
      ref={composeRefs(ownRef, props)}
      component={local.as}
      data-reach-tab=""
      data-orientation={orientation()}
      data-selected={isSelected() ? '' : undefined}
      disabled={local.disabled}
      id={`${tabsId()}---tab---${index()}`}
      onClick={onSelect}
      onFocus={composeEventHandler(local.onFocus as any, () => {
        setFocusedIndex(index());
      })}
      onBlur={composeEventHandler(local.onBlur as any, () => {
        setFocusedIndex(-1);
      })}
      type={htmlType()}
    >
      {local.children}
    </Dynamic>
  );
}
