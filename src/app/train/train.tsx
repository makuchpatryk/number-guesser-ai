import { createElement } from '../../libs/framework';
import { Grid, Result } from '../shared';
import {
  trainState,
  result,
  setTrain,
  saveToFile,
  removeItem,
  clearAll,
  loadSamples,
} from './train.service';

export default function Train() {
  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Train the Model</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Draw a digit on the grid, then click the matching number to label it.
        </p>
      </div>
      {/* Main two-column area */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left — drawing grid */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            1. Draw
          </p>
          <Grid grid={trainState.grid} />
        </div>
        {/* Right — digit pad + actions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              2. Label
            </p>
            <div className="flex flex-wrap gap-2">
              {trainState.buttons.map((num) => (
                <button
                  className="w-[66px] h-[66px] bg-zinc-800 hover:bg-indigo-600 border border-zinc-700 hover:border-indigo-500 text-zinc-100 rounded-xl text-xl font-bold transition-colors cursor-pointer"
                  type="button"
                  onClick={() => setTrain(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-800 mt-auto">
            <button
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 text-zinc-100 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              type="button"
              onClick={saveToFile}
            >
              Export Data
            </button>
            <button
              className="px-4 py-2 bg-zinc-700 hover:bg-indigo-600 border border-zinc-600 hover:border-indigo-500 text-zinc-100 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              type="button"
              onClick={loadSamples}
            >
              Load samples (0 &amp; 1)
            </button>
            <a
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer inline-block ml-auto"
              href="#/checker"
            >
              Go to Checker
            </a>
          </div>
        </div>
      </div>
      {/* Training data table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <Result result={result} onDelete={removeItem} onClearAll={clearAll} />
      </div>
    </div>
  );
}
