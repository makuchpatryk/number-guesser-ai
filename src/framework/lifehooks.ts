let currentElement: number | null = null;

export function setCurrentElement(el: Element) {
  currentElement = el.DOCUMENT_TYPE_NODE;
}

export function getCurrentElement() {
  return currentElement;
}

export const lifecycleHooks = new Map<number, (() => void)[]>();

export function onMounted(callback: () => void) {
  const currentElement = getCurrentElement();
  if (currentElement) {
    if (!lifecycleHooks.has(currentElement)) {
      lifecycleHooks.set(currentElement, []);
    }
    lifecycleHooks.get(currentElement)?.push(callback);
  }
}

export function runMountedHooks(el: Element) {
  const hooks = lifecycleHooks.get(el.DOCUMENT_TYPE_NODE);

  if (hooks) {
    hooks.forEach((hook) => hook());
    lifecycleHooks.delete(el.DOCUMENT_TYPE_NODE);
  }
}
