import { reactive } from '../../libs/framework';
import { localStorageAdapter } from '../../libs/storage';
import { createRepository } from '../repository';
import { ResultItem } from '../shared/models/result-item.model';
import { getInitialGrid, result } from '../shared';
import { SAMPLE_DATA } from './sample-data';

const { update, save, remove, clear } = createRepository(localStorageAdapter);

export const trainState = reactive<{
  buttons: number[];
  grid: boolean[][];
}>({
  buttons: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  grid: getInitialGrid(),
});

export { result };

export async function setTrain(num: number): Promise<void> {
  const newRow: ResultItem = {
    input: trainState.grid.flat().map((it) => +it),
    target: num,
  };
  result.push(newRow);
  trainState.grid = getInitialGrid();
  await update(newRow);
}

export function saveToFile(): void {
  save('data.txt', JSON.stringify(result));
}

export async function removeItem(index: number): Promise<void> {
  result.splice(index, 1);
  await remove(index);
}

export async function clearAll(): Promise<void> {
  result.splice(0, result.length);
  await clear();
}

export async function loadSamples(): Promise<void> {
  for (const item of SAMPLE_DATA) {
    result.push(item);
    await update(item);
  }
}
