export function createRouter(initialRoutes: Record<string, () => HTMLElement>) {
  const routes = initialRoutes;

  window.addEventListener('hashchange', () => handleRouteChange());
  handleRouteChange();

  function handleRouteChange() {
    const currentPath = window.location.hash.slice(1);
    const route = routes[currentPath];
    if (route) {
      route();
    } else {
      routes['/404']();
    }
  }
  return {
    handleRouteChange,
  };
}
