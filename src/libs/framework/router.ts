// router.js
import { reactive } from './reactive.ts';

export const router = reactive({
  path: window.location.pathname,
});

export function navigate(path: string) {
  history.pushState({}, '', path);
  router.path = path;
}

window.addEventListener('hashchange', () => {
  router.path = window.location.hash.slice(1);
});
