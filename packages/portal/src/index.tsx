import {
  JSX,
  createSignal,
  mergeProps,
  createEffect,
  onCleanup,
  Show,
  createRenderEffect,
} from 'solid-js';
import { Portal as SolidPortal } from 'solid-js/web';

export type PortalProps = {
  children?: JSX.Element;
  type?: string;
};

export default function Portal(props: PortalProps) {
  props = mergeProps({ type: 'reach-portal' }, props);
  let ownerDocument: Document | undefined;
  const [mountNode, setMountNode] = createSignal<HTMLElement>();
  const [portalNode, setPortalNode] = createSignal<HTMLElement>();

  createEffect(() => {
    const currentMountNode = mountNode();
    if (!currentMountNode) return;
    ownerDocument = currentMountNode.ownerDocument;
    setPortalNode(ownerDocument.createElement(props.type!));
  });

  createRenderEffect(() => {
    const currentPortalNode = portalNode();
    if (!currentPortalNode || !ownerDocument) return;
    ownerDocument.body?.appendChild(currentPortalNode);
    onCleanup(() => {
      if (currentPortalNode && currentPortalNode.ownerDocument) {
        currentPortalNode.ownerDocument.body?.removeChild(currentPortalNode);
      }
    });
  });

  return (
    <Show
      when={portalNode()}
      fallback={<span ref={(ref) => setMountNode(ref)} />}
    >
      <SolidPortal mount={portalNode()}>{props.children}</SolidPortal>
    </Show>
  );
}
