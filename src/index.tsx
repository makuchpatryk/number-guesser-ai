import Checker from './app/checker/checker.tsx';
import { createElement, RouteView } from './libs/framework';
import Train from './app/train/train.tsx';

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
