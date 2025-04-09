import { createElement, effect } from './index.ts';
import { router, routes } from './router.ts';

export function RouteView({ routes }) {
  const container = document.createElement('div');

  effect(() => {
    container.innerHTML = ''; // Clear previous view
    const match = routes[router.path];
    if (match) {
      const view = match(); // Assume it's a function component
      container.appendChild(view);
    } else {
      container.textContent = '404 Not Found';
    }
  });

  return container;
}
