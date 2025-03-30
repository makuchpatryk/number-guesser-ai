import { createElement } from './index.ts';
import { routes } from './router.ts';

export default function RouteView() {
  const currentPath = window.location.hash.slice(1);
  return routes ? (routes[currentPath]() as JSX.Element) : <div />;
}
