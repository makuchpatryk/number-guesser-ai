import Checker from './checker.tsx';
import { createElement } from './framework';
import { RouteView } from './framework/route-view.tsx';
import Train from './train.tsx';

export default () => {
  return (
    <div>
      <div>
        <a href="#/">Train</a>
        <a href="#/checker">Checker</a>
      </div>
      <RouteView
        routes={{
          '/': Train,
          '/checker': Checker,
        }}
      />
    </div>
  );
};
