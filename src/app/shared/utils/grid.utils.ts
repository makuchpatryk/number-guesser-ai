export const GRID_SIZE = 8;

export const getInitialGrid = (): boolean[][] =>
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));

