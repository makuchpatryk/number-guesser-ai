export type Component = () => Element;

let app: Element | null = null;
let globalComponent: Component | null = null;
function setGlobalComponent(component: Component) {
  globalComponent = component;
}

export function createElement(
  elementTag: Component | string,
  props: any,
  ...children: any[]
): Element {
  if (typeof elementTag === 'function') {
    return elementTag();
  }

  const element = document.createElement(elementTag);
  for (const key in props) {
    if (key.startsWith('on')) {
      element.addEventListener(key.substring(2).toLowerCase(), props[key]);
    } else {
      element.setAttribute(key, props[key]);
    }
  }
  children.flat().forEach((child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      element.appendChild(document.createTextNode(child.toString()));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  });
  return element;
}

export function createApp(component: Component) {
  return {
    mount(selector: string) {
      const el = document.querySelector(selector);
      if (el) {
        app = el;
        el.appendChild(component());
        setGlobalComponent(component);
      }
    },
  };
}

export function render() {
  if (app && globalComponent) {
    app.innerHTML = '';
    app.appendChild(globalComponent());
  }
}
