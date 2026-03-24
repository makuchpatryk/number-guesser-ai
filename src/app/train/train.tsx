import { createElement, reactive } from '../../libs/framework';
import { createRepository } from '../repository.ts';
import { getInitialGrid, Grid } from '../shared';
import { Result } from '../shared/result/result.tsx';
export interface ResultItem {
  input: number[];
  target: number;
}
let result = reactive<ResultItem[]>([]);

const state = reactive<{
  buttons: number[];
  grid: boolean[][];
  result: ResultItem[];
}>({
  buttons: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  grid: getInitialGrid(),
  result: [],
});

const { update, save, get } = createRepository();
result = get();

export default function Train() {
  function setTrain(num: number) {
    const newRow = {
      input: state.grid.flat().map((it) => +it),
      target: num,
    };
    result.push(newRow);
    state.grid = getInitialGrid();
    update(newRow);
  }

  return (
    <div>
      <h1 className="p-5 text-3xl font-extrabold">Train</h1>
      <section className="grid grid-cols-2 gap-2">
        <Grid grid={state.grid} />
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
        <Result result={result} />
      </section>
    </div>
  );
}
