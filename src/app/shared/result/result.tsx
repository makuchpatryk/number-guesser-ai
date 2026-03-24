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
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
          Training Data
          {result.length > 0 && (
            <span className="ml-2 text-xs font-normal text-zinc-500 normal-case">
              ({result.length} {result.length === 1 ? 'sample' : 'samples'})
            </span>
          )}
        </h2>
        {onClearAll && result.length > 0 && (
          <button
            data-testid="btn-clear-all"
            className="px-3 py-1 text-xs bg-zinc-800 hover:bg-rose-700 border border-zinc-700 hover:border-rose-600 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            type="button"
            onClick={onClearAll}
          >
            Clear all
          </button>
        )}
      </div>

      {result.length === 0 ? (
        <div className="text-center py-8 text-zinc-600 text-sm">
          No training data yet. Draw a digit and label it.
        </div>
      ) : (
        <div className="border border-zinc-800 rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_80px_40px] bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <div>Pattern</div>
            <div className="text-center">Target</div>
            <div />
          </div>
          {/* Table rows */}
          {result.map((it, index) => (
            <div
              data-testid="result-entry"
              className="grid grid-cols-[1fr_80px_40px] px-4 py-2.5 items-center border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors"
            >
              <div
                data-testid="result-entry-pattern"
                className="font-mono text-xs text-zinc-400 truncate"
              >
                {it.input.join(', ')}
              </div>
              <div data-testid="result-entry-target" className="text-center">
                <span className="inline-flex items-center justify-center w-7 h-7 bg-indigo-600/20 text-indigo-400 rounded-md text-sm font-bold">
                  {it.target}
                </span>
              </div>
              <div className="flex justify-end">
                {onDelete && (
                  <button
                    data-testid="btn-delete-entry"
                    className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:text-white hover:bg-rose-700 rounded-md transition-colors cursor-pointer text-xs"
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
      )}
    </div>
  );
}
