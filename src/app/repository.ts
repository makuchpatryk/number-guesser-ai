import { StorageAdapter } from '../libs/storage/storage.adapter';
import { ResultItem } from './shared/models/result-item.model';

const RESULT_KEY = 'result';

export interface Repository {
  save(filename: string, data: BlobPart): void;
  update(row: ResultItem): Promise<void>;
  remove(index: number): Promise<void>;
  clear(): Promise<void>;
  get(): Promise<ResultItem[]>;
}

export function createRepository(adapter: StorageAdapter): Repository {
  async function get(): Promise<ResultItem[]> {
    try {
      const data = await adapter.getItem(RESULT_KEY);
      return data ? (JSON.parse(data) as ResultItem[]) : [];
    } catch {
      console.warn('[Repository] Failed to parse stored data, resetting.');
      await adapter.removeItem(RESULT_KEY);
      return [];
    }
  }

  return {
    save(filename: string, data: BlobPart) {
      const blob = new Blob([data], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    get,
    async update(row: ResultItem): Promise<void> {
      const existing = await get();
      await adapter.setItem(RESULT_KEY, JSON.stringify([...existing, row]));
    },
    async remove(index: number): Promise<void> {
      const existing = await get();
      existing.splice(index, 1);
      await adapter.setItem(RESULT_KEY, JSON.stringify(existing));
    },
    async clear(): Promise<void> {
      await adapter.removeItem(RESULT_KEY);
    },
  };
}
