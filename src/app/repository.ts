import { ResultItem } from './shared/models/result-item.model';

export interface Repository {
  save(filename: string, data: BlobPart): void;
  update(row: ResultItem): void;
  get(): ResultItem[];
}

export function createRepository(): Repository {
  function get(): ResultItem[] {
    try {
      const data = localStorage.getItem('result');
      return data ? (JSON.parse(data) as ResultItem[]) : [];
    } catch {
      console.warn('[Repository] Failed to parse localStorage data, resetting.');
      localStorage.removeItem('result');
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
    update(row: ResultItem) {
      const existing = get();
      localStorage.setItem('result', JSON.stringify([...existing, row]));
    },
  };
}
