import App from '../app.tsx';
import { mount } from './framework.ts';

export type Routes = Record<string, () => Element>;

let routes: Routes | null = null;

export function createRouter(initialRoutes: Routes) {
  routes = initialRoutes;
  window.addEventListener('hashchange', () => handleRouteChange());
  handleRouteChange();

  function handleRouteChange() {
    const currentPath = window.location.hash.slice(1);
    const route = routes ? routes[currentPath] : null;
    if (route) {
      mount(route, document.getElementById('app')!);
    }
  }
}
export { routes };
