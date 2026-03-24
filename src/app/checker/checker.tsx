import { createElement } from '../../libs/framework';
import { Grid } from '../shared';
import { Result } from '../shared/result/result.tsx';
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
    <div>
      <h1 className="p-5 text-3xl font-extrabold">Checker</h1>
      <section className="grid grid-cols-2 gap-4 p-4">

        {/* Lewa kolumna — siatka + przyciski akcji */}
        <div>
          <Grid grid={checkerState.grid} />
          <div className="flex gap-2 mt-2">
            <button
              className="px-2 py-1 bg-[#aaaaaa] hover:bg-[#999999] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              id="btn-clean"
              type="button"
              onClick={onClean}
            >
              Clean
            </button>
            <button
              className="px-2 py-1 bg-[#aaaaaa] hover:bg-[#999999] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              id="btn-guess"
              type="button"
              disabled={checkerState.isTraining}
              onClick={onCheck}
            >
              Guess
            </button>
          </div>
          {checkerState.guessedNumber !== null && (
            <div className="mt-3 text-2xl font-bold">
              Wynik: {checkerState.guessedNumber}
            </div>
          )}
        </div>

        {/* Prawa kolumna — config + trening + postęp */}
        <div className="flex flex-col gap-3">

          {/* Konfiguracja treningu */}
          <div className="bg-[#888888] p-3 rounded">
            <h2 className="font-bold mb-2">Konfiguracja treningu</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <label>Max epok</label>
              <input
                className="px-1 bg-[#cccccc] w-full"
                type="number"
                value={checkerState.trainingConfig.epochs}
                onInput={(e: Event) => {
                  checkerState.trainingConfig.epochs = Number((e.target as HTMLInputElement).value);
                }}
              />
              <label>Learning rate</label>
              <input
                className="px-1 bg-[#cccccc] w-full"
                type="number"
                step="0.01"
                value={checkerState.trainingConfig.lr}
                onInput={(e: Event) => {
                  checkerState.trainingConfig.lr = Number((e.target as HTMLInputElement).value);
                }}
              />
              <label>ES próg</label>
              <input
                className="px-1 bg-[#cccccc] w-full"
                type="number"
                step="0.0000001"
                value={checkerState.trainingConfig.earlyStoppingThreshold}
                onInput={(e: Event) => {
                  checkerState.trainingConfig.earlyStoppingThreshold = Number(
                    (e.target as HTMLInputElement).value,
                  );
                }}
              />
              <label>ES cierpliwość</label>
              <input
                className="px-1 bg-[#cccccc] w-full"
                type="number"
                value={checkerState.trainingConfig.earlyStoppingPatience}
                onInput={(e: Event) => {
                  checkerState.trainingConfig.earlyStoppingPatience = Number(
                    (e.target as HTMLInputElement).value,
                  );
                }}
              />
              <label>Interwał postępu</label>
              <input
                className="px-1 bg-[#cccccc] w-full"
                type="number"
                value={checkerState.trainingConfig.progressInterval}
                onInput={(e: Event) => {
                  checkerState.trainingConfig.progressInterval = Number(
                    (e.target as HTMLInputElement).value,
                  );
                }}
              />
            </div>
          </div>

          {/* Przyciski treningu */}
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-[#aaaaaa] hover:bg-[#999999] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              id="btn-train"
              type="button"
              disabled={checkerState.isTraining}
              onClick={onTrain}
            >
              {checkerState.isTraining ? 'Trenowanie...' : 'Train'}
            </button>
            <button
              className="px-3 py-1 bg-[#cc6666] hover:bg-[#bb5555] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              id="btn-reset"
              type="button"
              disabled={checkerState.isTraining}
              onClick={onResetWeights}
            >
              Reset wag
            </button>
          </div>

          {/* Pasek postępu */}
          {checkerState.isTraining && checkerState.trainingProgress && (
            <div className="text-sm bg-[#888888] p-2 rounded">
              <div>Epoka: {checkerState.trainingProgress.epoch}</div>
              <div>Loss: {checkerState.trainingProgress.loss.toFixed(6)}</div>
            </div>
          )}
          {checkerState.isTraining && !checkerState.trainingProgress && (
            <div className="text-sm">Inicjalizacja treningu...</div>
          )}

        </div>
      </section>

      {/* Lista wyników */}
      <div className="p-4">
        <Result result={result} onDelete={removeItem} onClearAll={clearAll} />
      </div>
    </div>
  );
}
