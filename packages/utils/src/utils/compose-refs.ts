import { isFunction } from './is-function';

type RefType<El> = ((ref: El) => any) | HTMLElement;

type PropsWithRef<El> = {
  ref?: RefType<El>;
};

export function composeRefs<El = HTMLElement>(
  ownRef: { current?: El },
  ...props: PropsWithRef<El>[]
) {
  return (ref: El) => {
    ownRef.current = ref;
    for (const prop of props) {
      if (!prop.ref) continue;
      if (isFunction(prop.ref)) prop.ref(ref);
    }
  };
}
