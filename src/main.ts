import App from './app.tsx';
import Checker from './checker.tsx';
import { createApp } from './framework';
import { createRouter } from './framework/router.ts';
import Train from './train.tsx';

createApp(App).mount('#app');
createRouter({
  '/': Train,
  '/checker': Checker,
});
