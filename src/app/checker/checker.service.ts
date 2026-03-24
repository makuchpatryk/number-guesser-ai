import { reactive } from '../../libs/framework';
import { localStorageAdapter } from '../../libs/storage';
import {
  neuralNetworkFactory,
  createWeightsRepository,
  defaultTrainingConfig,
  TrainingConfig,
  SerializedWeights,
} from '../../libs/neural-network';
import { createRepository } from '../repository';
import { ResultItem } from '../shared/models/result-item.model';
import { getInitialGrid } from '../shared';

const { predict, setWeights } = neuralNetworkFactory();
const { get, remove, clear } = createRepository(localStorageAdapter);
const weightsRepo = createWeightsRepository(localStorageAdapter);

export const checkerState = reactive<{
  grid: boolean[][];
  guessedNumber: number | null;
  isTraining: boolean;
  trainingProgress: { epoch: number; loss: number } | null;
  trainingConfig: TrainingConfig;
}>({
  grid: getInitialGrid(),
  guessedNumber: null,
  isTraining: false,
  trainingProgress: null,
  trainingConfig: { ...defaultTrainingConfig },
});

export const result = reactive<ResultItem[]>([]);

// Async init — załaduj dane treningowe i wagi z storage
(async () => {
  const [items, savedWeights] = await Promise.all([get(), weightsRepo.loadWeights()]);
  items.forEach((item) => result.push(item));
  if (savedWeights) {
    setWeights(savedWeights);
  }
})();

export function onTrain(): void {
  if (checkerState.isTraining || result.length === 0) return;

  checkerState.isTraining = true;
  checkerState.trainingProgress = null;

  const worker = new Worker(
    new URL('../../libs/neural-network/neural-network.worker.ts', import.meta.url),
    { type: 'module' },
  );

  worker.onmessage = async (
    e: MessageEvent<
      | { type: 'PROGRESS'; epoch: number; loss: number }
      | { type: 'DONE'; weights: SerializedWeights }
      | { type: 'ERROR'; message: string }
    >,
  ) => {
    const { data } = e;

    if (data.type === 'PROGRESS') {
      checkerState.trainingProgress = { epoch: data.epoch, loss: data.loss };
    }

    if (data.type === 'DONE') {
      setWeights(data.weights);
      await weightsRepo.saveWeights(data.weights);
      checkerState.isTraining = false;
      worker.terminate();
    }

    if (data.type === 'ERROR') {
      console.error('[Checker] Training error:', data.message);
      checkerState.isTraining = false;
      worker.terminate();
    }
  };

  worker.postMessage({
    type: 'TRAIN',
    data: [...result].map((item) => ({
      input: Array.from(item.input),
      target: item.target,
    })),
    config: { ...checkerState.trainingConfig },
  });
}

export function onCheck(): void {
  checkerState.guessedNumber = Math.round(
    predict(checkerState.grid.flat().map((it) => +it)),
  );
}

export function onClean(): void {
  checkerState.grid = getInitialGrid();
}

export async function onResetWeights(): Promise<void> {
  await weightsRepo.clearWeights();
  checkerState.guessedNumber = null;
  checkerState.trainingProgress = null;
}

export async function removeItem(index: number): Promise<void> {
  result.splice(index, 1);
  await remove(index);
}

export async function clearAll(): Promise<void> {
  result.splice(0, result.length);
  await clear();
}

