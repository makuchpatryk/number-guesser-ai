declare namespace JSX {
  interface IntrinsicElements
    extends Record<keyof HTMLElementTagNameMap, Record<string, any>> {}

  interface Element extends HTMLElement {}
}
