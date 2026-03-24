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
    <div className="m-[10px]">
      {grid.map((row, keyRow) => (
        <div className="flex max-w-[500px]">
          {row.map((col, keyCol) => (
            <div
              data-testid="grid-cell"
              data-row={keyRow}
              data-col={keyCol}
              className={`w-[100px] h-[100px] block m-[5px] ${col ? 'bg-[red]' : 'bg-white'}`}
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
