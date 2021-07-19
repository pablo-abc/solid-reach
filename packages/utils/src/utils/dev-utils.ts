import { onMount } from 'solid-js';

let checkedPkgs: { [key: string]: boolean } = {};

/**
 * When in dev mode, checks that styles for a given `@solid-reach` package are loaded.
 *
 * @param packageName Name of the package to check.
 * @example checkStyles("dialog") will check for styles for @solid-reach/dialog
 */
export function checkStyles(packageName: string): void {
  if (__DEV__) {
    // In CJS files, process.env.NODE_ENV is stripped from our build, but we
    // need it to prevent style checks from clogging up user logs while testing.
    // This is a workaround until we can tweak the build a bit to accommodate.
    let { NODE_ENV: environment } =
      // @ts-ignore
      typeof process !== 'undefined'
        ? // @ts-ignore
          process.env
        : { NODE_ENV: 'development' };

    // only check once per package
    if (checkedPkgs[packageName]) return;
    checkedPkgs[packageName] = true;

    if (
      environment === 'development' &&
      parseInt(
        window
          .getComputedStyle(document.body)
          .getPropertyValue(`--reach-${packageName}`),
        10
      ) !== 1
    ) {
      console.warn(
        `@solid-reach/${packageName} styles not found. If you are using a bundler like webpack or parcel include this in the entry file of your app before any of your own styles:

      import "@solid-reach/${packageName}/styles.css";

    Otherwise you'll need to include them some other way:

      <link rel="stylesheet" type="text/css" href="node_modules/@solid-reach/${packageName}/styles.css" />

    For more information visit https://ui.reach.tech/styling.
    `
      );
    }
  }
}

/**
 * When in dev mode, checks that styles for a given `@solid-reach` package are loaded.
 *
 * @param packageName Name of the package to check.
 * @example useCheckStyles("dialog") will check for styles for @solid-reach/dialog
 */
export function useCheckStyles(packageName: string): void {
  if (__DEV__) {
    onMount(() => checkStyles(packageName));
  }
}
