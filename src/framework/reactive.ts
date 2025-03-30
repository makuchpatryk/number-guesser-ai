import { render } from './framework.ts';

let activeEffect: (() => void) | null = null;

export function reactive<T extends object>(obj: T): T {
  const deps = new Map<string | symbol, Set<() => void>>();

  function track(key: string | symbol) {
    if (activeEffect) {
      if (!deps.has(key)) {
        deps.set(key, new Set());
      }
      deps.get(key)!.add(activeEffect);
    }
  }

  function trigger(key: string | symbol) {
    if (deps.has(key)) {
      deps.get(key)!.forEach((effect) => effect());
    }
    render();
  }

  return new Proxy(obj, {
    get(target, key) {
      track(key);
      const value = Reflect.get(target, key);
      if (typeof value === 'object' && value !== null) {
        return reactive(value);
      }
      return value;
    },
    set(target, key, value) {
      Reflect.set(target, key, value);
      trigger(key);
      // TODO: to improve render
      render();
      return true;
    },
  });
}

export function effect(fn: () => void) {
  function wrappedEffect() {
    activeEffect = wrappedEffect;
    fn();
    activeEffect = null;
  }
  wrappedEffect();
}
