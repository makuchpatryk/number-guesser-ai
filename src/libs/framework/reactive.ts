type Effect = () => void;

let activeEffect: Effect | null = null;

const targetMap = new WeakMap<object, Map<string | symbol, Set<Effect>>>();

function track(target: object, key: string | symbol): void {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  dep.add(activeEffect);
}

function trigger(target: object, key: string | symbol): void {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach((effect) => effect());
  }
}

export function reactive<T extends object>(obj: T): T {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key);
      const value = Reflect.get(target, key);
      if (typeof value === 'object' && value !== null) {
        return reactive(value);
      }
      return value;
    },
    set(target, key, value) {
      Reflect.set(target, key, value);
      trigger(target, key);
      return true;
    },
  });
}

export function effect(fn: Effect) {
  function wrappedEffect() {
    activeEffect = wrappedEffect;
    fn();
    activeEffect = null;
  }
  wrappedEffect();
}
