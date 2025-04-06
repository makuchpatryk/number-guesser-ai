import '../public/style.css';
import App from './app.tsx';
import Checker from './checker.tsx';
import { mount } from './framework';
import { createRouter } from './framework/router.ts';
import Train from './train.tsx';

mount(App, document.getElementById('app')!);
createRouter({
  '/': Train,
  '/checker': Checker,
});
