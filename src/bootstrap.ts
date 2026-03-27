import App from './index.tsx';
import { mount } from './libs/framework';
import { initResultStore } from './app/shared';

(async () => {
  await initResultStore();
  mount(App, document.getElementById('app')!);
})();
