import { JSX, Accessor, createEffect, onCleanup, For } from 'solid-js';
import { render } from 'solid-js/web';
import VisuallyHidden from '@solid-reach/visually-hidden';
import { getOwnerDocument } from '@solid-reach/utils';

type Mirror = {
  mount: (element: JSX.Element) => void;
  update: (element: JSX.Element) => void;
  unmount: () => void;
};

type RegionTypes = 'polite' | 'assertive';

type ElementTypes = {
  [key in RegionTypes]: {
    [key: string]: JSX.Element;
  };
};

type RegionElements<T extends HTMLElement = HTMLDivElement> = {
  [key in RegionTypes]: T | null;
};

type RegionKeys = {
  [key in RegionTypes]: number;
};

let keys: RegionKeys = {
  polite: -1,
  assertive: -1,
};

let elements: ElementTypes = {
  polite: {},
  assertive: {},
};

let liveRegions: RegionElements = {
  polite: null,
  assertive: null,
};

let renderTimer: number | null;
let dispose: () => void | undefined;
function renderAlerts() {
  if (renderTimer != null) {
    window.clearTimeout(renderTimer);
  }
  if (dispose != null) {
    dispose();
  }
  renderTimer = window.setTimeout(() => {
    Object.keys(elements).forEach((elementType) => {
      let regionType: RegionTypes = elementType as RegionTypes;
      let container = liveRegions[regionType]!;
      if (container) {
        dispose = render(
          () => (
            <VisuallyHidden>
              <div
                role={regionType === 'assertive' ? 'alert' : 'status'}
                aria-live={regionType}
              >
                <For each={Object.keys(elements[regionType])}>
                  {(key) => {
                    return (elements[regionType][key] as Node).cloneNode(true);
                  }}
                </For>
              </div>
            </VisuallyHidden>
          ),
          container
        );
      }
    });
  }, 500);
}

function createMirror(type: 'polite' | 'assertive', doc: Document): Mirror {
  let key = ++keys[type];

  let mount = (element: JSX.Element) => {
    if (liveRegions[type]) {
      element = (element as Accessor<JSX.Element>)();
      elements[type][key] = element;
      renderAlerts();
    } else {
      let node = doc.createElement('div');
      node.setAttribute(`data-reach-live-${type}`, 'true');
      liveRegions[type] = node;
      doc.body.appendChild(liveRegions[type]!);
      mount(element);
    }
  };

  let update = (element: JSX.Element) => {
    element = (element as Accessor<JSX.Element>)();
    elements[type][key] = element;
    renderAlerts();
  };

  let unmount = () => {
    console.log(key);
    delete elements[type][key];
    renderAlerts();
  };

  return { mount, update, unmount };
}

export function useMirrorEffects(
  regionType: Accessor<RegionTypes>,
  element: Accessor<JSX.Element>,
  ref: Accessor<Element | undefined>
) {
  let prevType = regionType();
  let mirror: Mirror | null = null;
  let mounted = false;

  createEffect(() => {
    const ownerDocument = getOwnerDocument(ref())!;
    if (!mounted) {
      mounted = true;
      mirror = createMirror(regionType(), ownerDocument);
      mirror.mount(element());
    } else if (prevType !== regionType()) {
      prevType = regionType();
      mirror?.unmount();
      mirror = createMirror(regionType(), ownerDocument);
      mirror.mount(element());
    } else {
      mirror?.update(element());
    }
  });

  onCleanup(() => mirror?.unmount());
}
