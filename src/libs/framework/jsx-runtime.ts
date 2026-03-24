export function createElement(
  tag: any,
  props: any,
  ...children: any[]
): HTMLElement {
  props = props || {};
  children = children.flat();

  // Handle functional components
  if (typeof tag === 'function') {
    return tag({ ...props, children });
  }

  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith('on')) {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key.startsWith('data-') || key.startsWith('aria-')) {
      el.setAttribute(key, String(value));
    } else {
      (el as any)[key] = value;
    }
  }

  // Append children to the element
  for (const child of children) {
    el.appendChild(
      child instanceof Node ? child : document.createTextNode(String(child)),
    );
  }

  return el;
}
