import { createElement } from '../../../libs/framework';
import { ResultItem } from '../models/result-item.model';

interface ResultProps {
  result: ResultItem[];
  onDelete?: (index: number) => void;
  onClearAll?: () => void;
}

export function Result({ result, onDelete, onClearAll }: ResultProps) {
  return (
    <div data-testid="result-list">
      <div className="grid grid-cols-2 gap-2 w-full items-center my-[10px]">
        <div className="font-extrabold">Pattern</div>
        <div className="flex items-center justify-between">
          <div className="font-extrabold ml-[5px]">Result</div>
          {onClearAll && result.length > 0 && (
            <button
              data-testid="btn-clear-all"
              className="px-2 py-0.5 text-xs bg-[#cc4444] hover:bg-[#bb3333] cursor-pointer text-white"
              type="button"
              onClick={onClearAll}
            >
              Wyczyść wszystko
            </button>
          )}
        </div>
      </div>
      {result.map((it, index) => (
        <div data-testid="result-entry" className="grid grid-cols-2 gap-2 w-full items-center my-[5px]">
          <div data-testid="result-entry-pattern" className="font-extrabold text-sm">{it.input.join(',')}</div>
          <div className="flex items-center justify-between">
            <div data-testid="result-entry-target" className="ml-[5px]">{it.target}</div>
            {onDelete && (
              <button
                data-testid="btn-delete-entry"
                className="px-2 py-0.5 text-xs bg-[#cc4444] hover:bg-[#bb3333] cursor-pointer text-white"
                type="button"
                onClick={() => onDelete(index)}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
