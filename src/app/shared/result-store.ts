import { reactive } from '../../libs/framework';
import { localStorageAdapter } from '../../libs/storage';
import { createRepository } from '../repository';
import { ResultItem } from './models/result-item.model';
const { get, updateAt } = createRepository(localStorageAdapter);
export const result = reactive<ResultItem[]>([]);
let initialized = false;
export async function initResultStore(): Promise<void> {
  if (initialized) return;
  initialized = true;
  const items = await get();
  items.forEach((item) => result.push(item));
}
export async function updateItem(index: number, newItem: ResultItem): Promise<void> {
  result[index] = newItem;
  await updateAt(index, newItem);
}
