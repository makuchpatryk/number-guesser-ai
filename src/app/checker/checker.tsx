import { createElement } from '../../libs/framework';
import { Grid, Result } from '../shared';
import {
  checkerState,
  result,
  onTrain,
  onCheck,
  onClean,
  onResetWeights,
  removeItem,
  clearAll,
} from './checker.service';

export default function Checker() {
  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Check the Model</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Train the model first, then draw a digit and click Recognize to test
          it.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left — drawing + result */}
        <div className="flex flex-col gap-4">
          {/* Drawing card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              Draw a digit
            </p>
            <Grid grid={checkerState.grid} />
            <div className="flex gap-3 mt-4">
              <button
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 text-zinc-100 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                id="btn-clean"
                type="button"
                onClick={onClean}
              >
                Clear
              </button>
              <button
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                id="btn-guess"
                type="button"
                disabled={checkerState.isTraining}
                onClick={onCheck}
              >
                Recognize
              </button>
            </div>
          </div>

          {/* Result card */}
          <div
            className={`bg-zinc-900 border rounded-xl p-6 text-center transition-colors ${
              checkerState.guessedNumber !== null
                ? 'border-indigo-800'
                : 'border-zinc-800'
            }`}
          >
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Recognized digit
            </p>
            {checkerState.guessedNumber !== null ? (
              <p className="text-8xl font-black text-indigo-400 leading-none py-4">
                {checkerState.guessedNumber}
              </p>
            ) : (
              <p className="text-zinc-700 text-sm py-6">
                Draw something and click Recognize
              </p>
            )}
          </div>
        </div>

        {/* Right — config + model actions */}
        <div className="flex flex-col gap-4">
          {/* Config card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              Training config
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Max epochs', key: 'epochs', step: '1' },
                { label: 'Learning rate', key: 'lr', step: '0.01' },
                {
                  label: 'ES threshold',
                  key: 'earlyStoppingThreshold',
                  step: '0.0000001',
                },
                {
                  label: 'ES patience',
                  key: 'earlyStoppingPatience',
                  step: '1',
                },
                {
                  label: 'Progress interval',
                  key: 'progressInterval',
                  step: '100',
                },
              ].map(({ label, key, step }) => (
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm text-zinc-300 whitespace-nowrap">
                    {label}
                  </label>
                  <input
                    className="w-36 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 text-right"
                    type="number"
                    step={step}
                    value={(checkerState.trainingConfig as any)[key]}
                    onInput={(e: Event) => {
                      (checkerState.trainingConfig as any)[key] = Number(
                        (e.target as HTMLInputElement).value,
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Model actions card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Model
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                id="btn-train"
                type="button"
                disabled={checkerState.isTraining}
                onClick={onTrain}
              >
                {checkerState.isTraining ? 'Training...' : 'Train Model'}
              </button>
              <button
                className="px-4 py-2.5 bg-zinc-700 hover:bg-rose-700 border border-zinc-600 hover:border-rose-600 text-zinc-100 hover:text-white rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                id="btn-reset"
                type="button"
                disabled={checkerState.isTraining}
                onClick={onResetWeights}
              >
                Reset weights
              </button>
            </div>

            {/* Progress */}
            {checkerState.isTraining && (
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                {checkerState.trainingProgress ? (
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Epoch</span>
                      <span className="font-mono text-zinc-100">
                        {checkerState.trainingProgress.epoch.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Loss</span>
                      <span className="font-mono text-zinc-100">
                        {checkerState.trainingProgress.loss.toFixed(6)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-500 text-sm text-center">
                    Initializing...
                  </p>
                )}
              </div>
            )}
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
