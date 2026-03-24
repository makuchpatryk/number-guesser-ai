import { ResultItem } from './train/train.tsx';

export interface Repository {
  save(filename: string, data: BlobPart): void;
  update(row: any): void;
  get(): ResultItem[];
}
export function createRepository(): Repository {
  function get() {
    const data = localStorage.getItem('result');
    return data ? (JSON.parse(data) as any[]) : [];
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
    update(row: any[]) {
      const existRow = get();
      localStorage.setItem(
        'result',
        JSON.stringify([...(existRow || []), row]),
      );
    },
  };
}
