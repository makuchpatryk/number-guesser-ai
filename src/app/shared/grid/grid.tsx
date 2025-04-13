import { createElement } from '../../../libs/framework';

export const getInitialGrid = () => [
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
];

let activeMouse: boolean | null = null;

export function Grid({ grid }: { grid: boolean[][] }) {
  function onGridClick(x: number, y: number, value: boolean) {
    grid[x][y] = value;
  }
  return (
    <div className="m-[10px]" onmouseleave={() => (activeMouse = null)}>
      {grid.map((row, keyRow) => (
        <div className="flex max-w-[500px]">
          {row.map((col, keyCol) => (
            <div
              className={`w-[100px] h-[100px] block m-[5px] ${col ? 'bg-[red]' : 'bg-white'}`}
              onmouseover={() => {
                activeMouse !== null
                  ? onGridClick(keyRow, keyCol, activeMouse)
                  : null;
              }}
              onmousedown={() => {
                activeMouse = !grid[keyRow][keyCol];
                onGridClick(keyRow, keyCol, activeMouse);
              }}
              onmouseup={() => (activeMouse = null)}
              onclick={() => onGridClick(keyRow, keyCol, !grid[keyRow][keyCol])}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
