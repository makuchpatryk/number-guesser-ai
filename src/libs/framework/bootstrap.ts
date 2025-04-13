import { effect } from './reactive.ts';

export function mount(Component: () => Element, container: HTMLElement) {
  let prevVNode: HTMLElement | null = null;

  effect(() => {
    if (prevVNode) {
      container.removeChild(prevVNode);
    }

    const el = Component();
    prevVNode = el as HTMLElement;
    container.appendChild(el);
  });
}
