import { createElement, reactive } from '../../libs/framework';
import { createRepository } from '../repository.ts';
import { getInitialGrid, Grid } from '../shared';

const state = reactive({
  grid: getInitialGrid(),
  guestNumber: null,
});
const { get } = createRepository();

function onTrain() {
  console.log(get());
}

export default function Train() {
  return (
    <div>
      <h1 className="p-5 text-3xl font-extrabold">Train</h1>
      <section className="grid grid-cols-2 gap-2">
        <Grid grid={state.grid} />
        <div className="flex gap-[5px] w-full flex-wrap m-[10px] size-fit">
          <h1>{state.guestNumber}</h1>
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
          >
            Guess
          </button>
        </div>
      </section>
    </div>
  );
}
