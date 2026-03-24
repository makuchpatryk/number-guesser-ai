import { createElement, reactive } from '../../libs/framework';
import { neuralNetworkFactory } from '../../libs/neural-network';
import { createRepository } from '../repository.ts';
import { getInitialGrid, Grid } from '../shared';
import { Result } from '../shared/result/result.tsx';
import { ResultItem } from '../train';

const state = reactive<{
  grid: boolean[][];
  guestNumber: number | null;
  result: ResultItem[] | null;
}>({
  grid: getInitialGrid(),
  guestNumber: null,
  result: null,
});
let result = reactive<ResultItem[]>([]);

const { train, predict } = neuralNetworkFactory();

const { get } = createRepository();
state.result = get();
function onTrain() {
  console.log('Train started', state.result);
  if (state.result) {
    train(state.result);
  }
  console.log('Train finished');
}

function onCheck() {
  state.guestNumber = Math.round(predict(state.grid.flat().map((it) => +it)));
}
function onClean() {
  state.grid = getInitialGrid();
}
result = get();
export default function Checker() {
  return (
    <div>
      <h1 className="p-5 text-3xl font-extrabold">Train</h1>
      <section className="grid grid-cols-2 gap-2">
        <button
          className="px-2 py-1 bg-[#aaaaaa] hover:bg-[#999999] m-1 cursor-pointer"
          id="guess"
          type="button"
          onClick={onClean}
        >
          Clean
        </button>
        <Grid grid={state.grid} />
        <div className="flex gap-[5px] w-full flex-wrap m-[10px] size-fit">
          <h1>{state.guestNumber}</h1>
          <Result result={result} />
        </div>
        <div>
          <button
            className="px-2 py-1 bg-[#aaaaaa] hover:bg-[#999999] m-1 cursor-pointer"
            id="guess"
            type="button"
            onClick={onTrain}
          >
            Train
          </button>
          <button
            className="px-2 py-1 bg-[#aaaaaa] hover:bg-[#999999] m-1 cursor-pointer"
            id="guess"
            type="button"
            onClick={onCheck}
          >
            Guess
          </button>
        </div>
      </section>
    </div>
  );
}
