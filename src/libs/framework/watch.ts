import { effect } from './reactive.ts';

export function watch<T>(
  getter: () => T,
  callback: (newValue: T, oldValue: T) => void,
) {
  let oldValue = getter();

  effect(() => {
    const newValue = getter();
    if (newValue !== oldValue) {
      callback(newValue, oldValue);
      oldValue = newValue;
    }
  });
}
