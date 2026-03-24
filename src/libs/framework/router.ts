import { reactive } from './reactive.ts';

export const router = reactive({
  path: window.location.hash.slice(1) || '/',
});

export function navigate(path: string) {
  window.location.hash = path;
  // hashchange event zaktualizuje router.path automatycznie
}

window.addEventListener('hashchange', () => {
  router.path = window.location.hash.slice(1) || '/';
});
