import { NeuralNetwork, TrainingConfig } from './neural-network';
import { ResultItem } from '../../app/shared/models/result-item.model';

interface TrainMessage {
  type: 'TRAIN';
  data: ResultItem[];
  config: TrainingConfig;
}

self.onmessage = (e: MessageEvent<TrainMessage>) => {
  if (e.data.type !== 'TRAIN') return;

  const { data, config } = e.data;

  try {
    const nn = new NeuralNetwork(9, 10);
    const inputs = data.map((d) => d.input);
    const targets = data.map((d) => d.target);

    nn.train(inputs, targets, config, (epoch, loss) => {
      self.postMessage({ type: 'PROGRESS', epoch, loss });
    });

    self.postMessage({ type: 'DONE', weights: nn.getWeights() });
  } catch (err) {
    self.postMessage({
      type: 'ERROR',
      message: err instanceof Error ? err.message : String(err),
    });
  }
};

