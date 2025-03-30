import { reactive } from './reactive.ts';

export function ref<T>(initialValue: T) {
  const wrapper = {
    value: initialValue,
  };

  return reactive(wrapper);
}
