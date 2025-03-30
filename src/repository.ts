export interface Repository {
  save(filename: string, data: BlobPart): void;
}
export function createRepository(): Repository {
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
  };
}
