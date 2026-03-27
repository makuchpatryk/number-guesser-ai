import { createElement } from '../../../libs/framework';

let activeMouse: boolean | null = null;

// Globalny reset — mouseup może wypaść poza komórką (gap, poza gridem, poza oknem)
document.addEventListener('mouseup', () => {
  activeMouse = null;
});

export function Grid({ grid }: { grid: boolean[][] }) {
  function onGridClick(x: number, y: number, value: boolean) {
    grid[x][y] = value;
  }
  return (
    <div className="select-none grid grid-cols-8 gap-1 w-full">
      {grid.flat().map((col, index) => {
        const keyRow = Math.floor(index / grid[0].length);
        const keyCol = index % grid[0].length;
        return (
          <div
            data-testid="grid-cell"
            data-row={keyRow}
            data-col={keyCol}
            className={`aspect-square rounded-sm border cursor-crosshair transition-colors ${
              col
                ? 'bg-indigo-500 border-indigo-400'
                : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700'
            }`}
            onmouseenter={() => {
              if (activeMouse !== null) {
                onGridClick(keyRow, keyCol, activeMouse);
              }
            }}
            onmousedown={() => {
              activeMouse = !grid[keyRow][keyCol];
              onGridClick(keyRow, keyCol, activeMouse);
            }}
            onmouseup={() => { activeMouse = null; }}
          />
        );
      })}
    </div>
  );
}
