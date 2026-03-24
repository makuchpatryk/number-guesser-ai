import Checker from './app/checker/checker.tsx';
import { createElement, RouteView } from './libs/framework';
import Train from './app/train/train.tsx';

export default () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧠</span>
            <span className="font-bold text-lg text-white tracking-tight">NumberGuesser</span>
            <span className="text-xs text-zinc-500 font-medium bg-zinc-800 px-2 py-0.5 rounded-full">AI</span>
          </div>
          <div className="flex gap-1">
            <a
              className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-sm font-medium"
              href="#/"
            >
              Train
            </a>
            <a
              className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-sm font-medium"
              href="#/checker"
            >
              Checker
            </a>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <RouteView
          routes={{
            '/': Train,
            '/checker': Checker,
          }}
        />
      </main>
    </div>
  );
};
