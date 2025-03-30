import { createElement } from './framework';
import RouteView from './framework/route-view.tsx';

export default () => {
  return (
    <div>
      <div>
        <a href="#/">Train</a>
        <a href="#/checker">Checker</a>
      </div>
      <RouteView />
    </div>
  );
};
