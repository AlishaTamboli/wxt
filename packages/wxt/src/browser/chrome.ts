/// <reference types="chrome" />

export type Browser = typeof chrome;

export type AugmentedBrowser = Browser & {
  runtime: WxtRuntime;
  i18n: WxtI18n;
};

export interface WxtRuntime {
  // Overriden per-project
}

export interface WxtI18n {
  // Overriden per-project
}

export const browser: AugmentedBrowser =
  // @ts-expect-error
  globalThis.browser?.runtime?.id == null
    ? globalThis.chrome
    : // @ts-expect-error
      globalThis.browser;
