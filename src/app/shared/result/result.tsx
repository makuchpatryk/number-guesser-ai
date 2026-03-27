import { createElement } from '../../../libs/framework';
import { ResultItem } from '../models/result-item.model';
import { updateItem } from '../result-store';
const GRID_SIZE = 8;
function MiniGrid({ input }: { input: number[] }) {
  return (
    <div
      className="grid cursor-pointer hover:opacity-75 transition-opacity"
      style={`grid-template-columns: repeat(${GRID_SIZE}, 1fr); gap: 1px; width: ${GRID_SIZE * 7}px; height: ${GRID_SIZE * 7}px;`}
    >
      {input.map((cell) => (
        <div
          className={cell ? 'bg-indigo-500' : 'bg-zinc-700'}
          style="border-radius: 1px;"
        />
      ))}
    </div>
  );
}
function showGridModal(item: ResultItem, index: number) {
  // local editable copy
  const editInput = [...item.input];
  const cellSize = 44;
  const gap = 4;
  const totalSize = GRID_SIZE * cellSize + (GRID_SIZE - 1) * gap;
  const overlay = document.createElement('div');
  overlay.className =
    'fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm select-none';
  overlay.innerHTML = `
    <div class="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Edit pattern</span>
        <button id="modal-close" class="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-700 rounded-md transition-colors text-xs cursor-pointer">x</button>
      </div>
      <div
        id="modal-grid"
        class="grid gap-1"
        style="grid-template-columns: repeat(${GRID_SIZE}, ${cellSize}px); width:${totalSize}px;"
      >
        ${editInput
          .map(
            (cell, i) =>
              `<div
                data-idx="${i}"
                class="modal-cell ${cell ? 'bg-indigo-500 border-indigo-400' : 'bg-zinc-800 border-zinc-700'} border rounded-sm cursor-crosshair transition-colors"
                style="width:${cellSize}px;height:${cellSize}px;"
              ></div>`,
          )
          .join('')}
      </div>
      <div class="flex items-center justify-between pt-2 border-t border-zinc-800">
        <div class="flex items-center gap-2">
          <span class="text-zinc-500 text-sm">Target label:</span>
          <span class="inline-flex items-center justify-center w-9 h-9 bg-indigo-600/20 text-indigo-400 rounded-lg text-lg font-bold">${item.target}</span>
        </div>
        <div class="flex gap-2">
          <button id="modal-clear" class="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer">Clear</button>
          <button id="modal-save" class="px-4 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors cursor-pointer font-semibold">Save changes</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  // ── cell paint logic ──────────────────────────────────────────
  let activePaint: 1 | 0 | null = null;
  function applyCell(el: HTMLElement) {
    const idx = Number(el.dataset.idx);
    if (isNaN(idx)) return;
    editInput[idx] = activePaint!;
    el.className = `modal-cell ${
      activePaint
        ? 'bg-indigo-500 border-indigo-400'
        : 'bg-zinc-800 border-zinc-700'
    } border rounded-sm cursor-crosshair transition-colors`;
    (el as any).style.cssText = `width:${cellSize}px;height:${cellSize}px;`;
  }
  const grid = overlay.querySelector('#modal-grid')!;
  grid.addEventListener('mousedown', (e) => {
    const target = (e as MouseEvent).target as HTMLElement;
    if (!target.classList.contains('modal-cell')) return;
    const idx = Number(target.dataset.idx);
    activePaint = editInput[idx] ? 0 : 1;
    applyCell(target);
  });
  grid.addEventListener('mouseover', (e) => {
    if (activePaint === null) return;
    const target = (e as MouseEvent).target as HTMLElement;
    if (target.classList.contains('modal-cell')) applyCell(target);
  });
  document.addEventListener(
    'mouseup',
    () => {
      activePaint = null;
    },
    { once: false },
  );
  // ── buttons ───────────────────────────────────────────────────
  const close = () => document.body.removeChild(overlay);
  overlay.querySelector('#modal-close')!.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  overlay.querySelector('#modal-clear')!.addEventListener('click', () => {
    for (let i = 0; i < editInput.length; i++) editInput[i] = 0;
    grid.querySelectorAll<HTMLElement>('.modal-cell').forEach((el) => {
      Number(el.dataset.idx);
      el.className =
        'modal-cell bg-zinc-800 border-zinc-700 border rounded-sm cursor-crosshair transition-colors';
      (el as any).style.cssText = `width:${cellSize}px;height:${cellSize}px;`;
    });
  });
  overlay.querySelector('#modal-save')!.addEventListener('click', async () => {
    const updated: ResultItem = { ...item, input: [...editInput] };
    await updateItem(index, updated);
    close();
  });
}
interface ResultProps {
  result: ResultItem[];
  onDelete?: (index: number) => void;
  onClearAll?: () => void;
}
export function Result({ result, onDelete, onClearAll }: ResultProps) {
  return (
    <div data-testid="result-list">
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
          <div className="grid grid-cols-[1fr_80px_40px] bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <div>Pattern</div>
            <div className="text-center">Target</div>
            <div />
          </div>
          {result.map((it, index) => (
            <div
              data-testid="result-entry"
              className="grid grid-cols-[1fr_80px_40px] px-4 py-2 items-center border-t border-zinc-800 hover:bg-zinc-800/50 transition-colors"
            >
              <div
                data-testid="result-entry-pattern"
                title="Click to edit pattern"
                onClick={() => showGridModal(it, index)}
              >
                <MiniGrid input={it.input} />
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
                    x
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
