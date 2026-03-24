import { reactive } from '../../libs/framework';
import { neuralNetworkFactory } from '../../libs/neural-network';
import { createRepository } from '../repository';
import { ResultItem } from '../shared/models/result-item.model';
import { getInitialGrid } from '../shared';

const { train, predict } = neuralNetworkFactory();
const { get } = createRepository();

export const checkerState = reactive<{
  grid: boolean[][];
  guessedNumber: number | null;
}>({
  grid: getInitialGrid(),
  guessedNumber: null,
});

// Inicjalizacja — dane z localStorage wpadają DO reactive proxy (nie zastępują go)
export const result = reactive<ResultItem[]>([]);
get().forEach((item) => result.push(item));

export function onTrain() {
  if (result.length === 0) return;
  train([...result]);
}

export function onCheck() {
  checkerState.guessedNumber = Math.round(
    predict(checkerState.grid.flat().map((it) => +it)),
  );
}

export function onClean() {
  checkerState.grid = getInitialGrid();
}

