import { createElement } from '../../libs/framework';
import { Grid } from '../shared';
import { Result } from '../shared/result/result.tsx';
import { trainState, result, setTrain, saveToFile, removeItem, clearAll } from './train.service';

export default function Train() {
  return (
    <div>
      <h1 className="p-5 text-3xl font-extrabold">Train</h1>
      <section className="grid grid-cols-2 gap-2">
        <Grid grid={trainState.grid} />
        <div className="flex gap-[5px] w-full flex-wrap m-[10px] size-fit">
          {trainState.buttons.map((num) => (
            <button
              className="w-[100px] h-[100px] block m-[3px] bg-[#aaaaaa] hover:bg-[#999999] cursor-pointer"
              type="button"
              onClick={() => setTrain(num)}
            >
              {num}
            </button>
          ))}
        </div>
        <div>
          <button
            className="px-2 py-1 bg-[#aaaaaa] hover:bg-[#999999] m-1 cursor-pointer"
            type="button"
            onClick={saveToFile}
          >
            Save to file
          </button>
          <a
            className="px-2 py-1 bg-[#aaaaaa] hover:bg-[#999999] m-1 cursor-pointer"
            href="#/checker"
          >
            Go to Checker
          </a>
        </div>
        <Result result={result} onDelete={removeItem} onClearAll={clearAll} />
      </section>
    </div>
  );
}
