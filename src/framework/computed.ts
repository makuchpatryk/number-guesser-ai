import { effect } from './reactive.ts';

export function computed<T>(getter: () => T) {
  let value: T;
  let dirty = true;

  const effectFn = () =>
    effect(() => {
      value = getter();
      dirty = false;
    });

  return {
    get value() {
      if (dirty) effectFn();
      return value;
    },
  };
}
