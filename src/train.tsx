import { createElement, reactive } from './framework';
import { onMounted } from './framework/lifehooks.ts';
import { createRepository } from './repository.ts';
interface ResultItem {
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

  onMounted(() => {
    console.log('update', result, get());
    const tt = get();
    if (tt) result = tt;
    console.log('update', result);
  });

  return (
    <div>
      <h1>Train</h1>
      <section className="panel">
        <div className="canvas" onmouseleave={() => (activeMouse = null)}>
          {state.grid.map((row, keyRow) => (
            <div className="row">
              {row.map((col, keyCol) => (
                <div
                  className={`col ${col ? 'active' : ''}`}
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
        <div className="numbers">
          {state.buttons.map((num) => (
            <button type="button" onclick={() => setTrain(num)}>
              {num}
            </button>
          ))}
        </div>

        <div className="actions">
          <button
            type="button"
            onclick={() => save('data.txt', JSON.stringify(result))}
          >
            Save to train
          </button>
          <button id="guess" type="button">
            <a href="./guesser.html">Guess</a>
          </button>
        </div>
        <div className="result-container flex">
          <div className="row">
            <div className="list">Pattern</div>{' '}
            <div className="result">Result</div>
          </div>
          {result.map((it) => (
            <div className="row">
              <div className="list">{it.list}</div>{' '}
              <div className="result">{it.result}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
