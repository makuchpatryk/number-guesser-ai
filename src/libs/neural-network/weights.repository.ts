import { StorageAdapter } from '../storage/storage.adapter';
import { SerializedWeights } from './neural-network';

const WEIGHTS_KEY = 'nn_weights';

export interface WeightsRepository {
  saveWeights(weights: SerializedWeights): Promise<void>;
  loadWeights(): Promise<SerializedWeights | null>;
  clearWeights(): Promise<void>;
}

export function createWeightsRepository(
  adapter: StorageAdapter,
): WeightsRepository {
  return {
    async saveWeights(weights: SerializedWeights): Promise<void> {
      await adapter.setItem(WEIGHTS_KEY, JSON.stringify(weights));
    },

    async loadWeights(): Promise<SerializedWeights | null> {
      try {
        const data = await adapter.getItem(WEIGHTS_KEY);
        return data ? (JSON.parse(data) as SerializedWeights) : null;
      } catch {
        console.warn('[WeightsRepository] Failed to load weights, clearing.');
        await adapter.removeItem(WEIGHTS_KEY);
        return null;
      }
    },

    async clearWeights(): Promise<void> {
      await adapter.removeItem(WEIGHTS_KEY);
    },
  };
}

