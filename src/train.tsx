import { createElement, reactive } from './framework';
import { createRepository } from './repository.ts';
export interface ResultItem {
  list: number[];
  result: number;
}
let result = reactive<ResultItem[]>([]);
const getInitialGrid = () => [
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
  [false, false, false, false, false],
];
const state = reactive({
  grid: getInitialGrid(),
  buttons: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
});
let activeMouse: boolean | null = null;
const { update, save, get } = createRepository();
result = get();

export default function Train() {
  function onGridClick(x: number, y: number, value: boolean) {
    state.grid[x][y] = value;
    console.log('onGridClick', state.grid);
  }

  function setTrain(num: number) {
    const newRow = {
      list: state.grid.flat().map((it) => +it),
      result: num,
    };
    result.push(newRow);
    state.grid = getInitialGrid();
    update(newRow);
  }

  return (
    <div>
      <h1 className="p-5 text-3xl font-extrabold">Train</h1>
      <section className="grid grid-cols-2 gap-2">
        <div className="m-[10px]" onmouseleave={() => (activeMouse = null)}>
          {state.grid.map((row, keyRow) => (
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
                    activeMouse = !state.grid[keyRow][keyCol];
                    onGridClick(keyRow, keyCol, activeMouse);
                  }}
                  onmouseup={() => (activeMouse = null)}
                  onclick={() =>
                    onGridClick(keyRow, keyCol, !state.grid[keyRow][keyCol])
                  }
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex gap-[5px] w-full flex-wrap m-[10px] size-fit">
          {state.buttons.map((num) => (
            <button
              className="w-[100px] h-[100px] block m-[3px] bg-[#aaaaaa] hover:bg-[#999999] cursor-pointer"
              type="button"
              onclick={() => setTrain(num)}
            >
              {num}
            </button>
          ))}
        </div>
        <div>
          <button
            className="px-2 py-1 bg-[#aaaaaa] hover:bg-[#999999] m-1 cursor-pointer"
            type="button"
            onclick={() => save('data.txt', JSON.stringify(result))}
          >
            Save to train
          </button>
          <button
            className="px-2 py-1 bg-[#aaaaaa] hover:bg-[#999999] m-1 cursor-pointer"
            id="guess"
            type="button"
          >
            <a href="./guesser.html">Guess</a>
          </button>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-2 w-full items-center my-[10px]">
            <div className="font-extrabold">Pattern</div>{' '}
            <div className="font-extrabold ml-[5px]">Result</div>
          </div>
          {result.map((it) => (
            <div className="grid grid-cols-2 gap-2 w-full items-center my-[5px]">
              <div className="font-extrabold">{it.list}</div>{' '}
              <div className="ml-[5px]">{it.result}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
