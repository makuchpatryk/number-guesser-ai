import { createElement, reactive } from './framework';
import { createRepository } from './repository.ts';
const data: { list: number[]; result: number }[] = [];
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
const { save } = createRepository();

export default () => {
  function onGridClick(x: number, y: number, value: boolean) {
    state.grid[x][y] = value;
  }

  function setTrain(num: number) {
    data.push({
      list: state.grid.flat().map((it) => +it),
      result: num,
    });
    state.grid = getInitialGrid();
  }

  return (
    <div>
      {state}
      <h1>Train</h1>
      <section class="panel">
        <div class="canvas" onmouseleave={() => (activeMouse = null)}>
          {state.grid.map((row, keyRow) => (
            <div class="row">
              {row.map((col, keyCol) => (
                <div
                  class={`col ${col ? 'active' : ''}`}
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
        <div class="numbers">
          {state.buttons.map((num) => (
            <button type="button" onclick={() => setTrain(num)}>
              {num}
            </button>
          ))}
        </div>

        <div class="actions">
          <button
            type="button"
            onclick={() => save('data.txt', JSON.stringify(data))}
          >
            Save to train
          </button>
          <button id="guess" type="button">
            <a href="./guesser.html">Guess</a>
          </button>
        </div>
      </section>
    </div>
  );
};
