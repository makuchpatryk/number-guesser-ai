import { createElement } from '../../libs/framework';
import { Grid } from '../shared';
import { Result } from '../shared/result/result.tsx';
import { checkerState, result, onTrain, onCheck, onClean } from './checker.service';

export default function Checker() {
  return (
    <div>
      <h1 className="p-5 text-3xl font-extrabold">Checker</h1>
      <section className="grid grid-cols-2 gap-2">
        <button
          className="px-2 py-1 bg-[#aaaaaa] hover:bg-[#999999] m-1 cursor-pointer"
          id="btn-clean"
          type="button"
          onClick={onClean}
        >
          Clean
        </button>
        <Grid grid={checkerState.grid} />
        <div className="flex gap-[5px] w-full flex-wrap m-[10px] size-fit">
          <h1>{checkerState.guessedNumber}</h1>
          <Result result={result} />
        </div>
        <div>
          <button
            className="px-2 py-1 bg-[#aaaaaa] hover:bg-[#999999] m-1 cursor-pointer"
            id="btn-train"
            type="button"
            onClick={onTrain}
          >
            Train
          </button>
          <button
            className="px-2 py-1 bg-[#aaaaaa] hover:bg-[#999999] m-1 cursor-pointer"
            id="btn-guess"
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
