import { effect } from './index.ts';
import { router } from './router.ts';

export function RouteView({
  routes,
}: {
  routes: Record<string, () => JSX.Element>;
}) {
  const container = document.createElement('div');

  effect(() => {
    container.innerHTML = '';
    const match = routes[router.path];
    if (match) {
      const view = match();
      container.appendChild(view);
    } else {
      container.textContent = '404 Not Found';
    }
  });

  return container;
}
