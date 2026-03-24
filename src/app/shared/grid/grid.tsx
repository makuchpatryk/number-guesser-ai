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
    <div className="select-none">
      {grid.map((row, keyRow) => (
        <div className="flex">
          {row.map((col, keyCol) => (
            <div
              data-testid="grid-cell"
              data-row={keyRow}
              data-col={keyCol}
              className={`w-[96px] h-[96px] m-[4px] rounded-lg border-2 cursor-crosshair transition-colors ${
                col
                  ? 'bg-[red] border-red-700'
                  : 'bg-zinc-100 border-zinc-300 hover:bg-zinc-200'
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
          ))}
        </div>
      ))}
    </div>
  );
}
