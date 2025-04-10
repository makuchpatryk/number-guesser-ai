import Checker from './checker.tsx';
import { createElement } from './framework';
import { RouteView } from './framework/route-view.tsx';
import Train from './train.tsx';

export default () => {
  return (
    <div>
      <div className="p-5">
        <a className="cursor-pointer text-[blue] m-2" href="#/">
          Train
        </a>
        <a className="cursor-pointer text-[blue] m-2" href="#/checker">
          Checker
        </a>
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
