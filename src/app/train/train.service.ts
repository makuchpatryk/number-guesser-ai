import { reactive } from '../../libs/framework';
import { createRepository } from '../repository';
import { ResultItem } from '../shared/models/result-item.model';
import { getInitialGrid } from '../shared';

const { update, save, get } = createRepository();

export const trainState = reactive<{
  buttons: number[];
  grid: boolean[][];
}>({
  buttons: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  grid: getInitialGrid(),
});

export const result = reactive<ResultItem[]>([]);

// Inicjalizacja — dane z localStorage wpadają DO reactive proxy (nie zastępują go)
get().forEach((item) => result.push(item));

export function setTrain(num: number) {
  const newRow: ResultItem = {
    input: trainState.grid.flat().map((it) => +it),
    target: num,
  };
  result.push(newRow);
  trainState.grid = getInitialGrid();
  update(newRow);
}

export function saveToFile() {
  save('data.txt', JSON.stringify(result));
}

