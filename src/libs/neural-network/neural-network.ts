export interface SerializedWeights {
  weightsInputHidden: number[][];
  weightsHiddenOutput: number[];
}

export interface TrainingConfig {
  epochs: number;
  lr: number;
  earlyStoppingThreshold: number;
  earlyStoppingPatience: number;
  progressInterval: number;
}

export const defaultTrainingConfig: TrainingConfig = {
  epochs: 300000,
  lr: 0.1,
  earlyStoppingThreshold: 1e-6,
  earlyStoppingPatience: 5,
  progressInterval: 1000,
};

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function sigmoidDerivative(x: number): number {
  return x * (1 - x);
}

function dot(a: Float32Array, b: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

function addBias(inputs: Float32Array): Float32Array {
  const out = new Float32Array(inputs.length + 1);
  out.set(inputs);
  out[inputs.length] = 1;
  return out;
}

export class NeuralNetwork {
  inputSize: number;
  hiddenSize: number;

  weightsInputHidden: Float32Array[];
  weightsHiddenOutput: Float32Array;

  constructor(inputSize: number, hiddenSize: number) {
    this.inputSize = inputSize + 1; // +1 for bias
    this.hiddenSize = hiddenSize;

    this.weightsInputHidden = Array.from({ length: this.hiddenSize }, () => {
      const arr = new Float32Array(this.inputSize);
      for (let i = 0; i < this.inputSize; i++) arr[i] = Math.random() * 2 - 1;
      return arr;
    });

    this.weightsHiddenOutput = new Float32Array(this.hiddenSize + 1);
    for (let i = 0; i < this.hiddenSize + 1; i++) {
      this.weightsHiddenOutput[i] = Math.random() * 2 - 1;
    }
  }

  getWeights(): SerializedWeights {
    return {
      weightsInputHidden: this.weightsInputHidden.map((row) => Array.from(row)),
      weightsHiddenOutput: Array.from(this.weightsHiddenOutput),
    };
  }

  setWeights(w: SerializedWeights): void {
    this.weightsInputHidden = w.weightsInputHidden.map((row) =>
      Float32Array.from(row),
    );
    this.weightsHiddenOutput = Float32Array.from(w.weightsHiddenOutput);
  }

  predict(input: number[]): number {
    const inputWithBias = addBias(Float32Array.from(input));
    const hidden = new Float32Array(this.hiddenSize);
    for (let j = 0; j < this.hiddenSize; j++) {
      hidden[j] = sigmoid(dot(this.weightsInputHidden[j], inputWithBias));
    }
    const hiddenWithBias = addBias(hidden);
    const output = sigmoid(dot(this.weightsHiddenOutput, hiddenWithBias));
    return output * 9;
  }

  train(
    inputs: number[][],
    targets: number[],
    config: TrainingConfig = defaultTrainingConfig,
    onProgress?: (epoch: number, loss: number) => void,
  ): void {
    const { epochs, lr, earlyStoppingThreshold, earlyStoppingPatience, progressInterval } = config;

    let bestLoss = Infinity;
    let patienceCounter = 0;

    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalLoss = 0;

      for (let i = 0; i < inputs.length; i++) {
        const target = targets[i] / 9;
        const inputWithBias = addBias(Float32Array.from(inputs[i]));

        // Forward pass
        const hidden = new Float32Array(this.hiddenSize);
        for (let j = 0; j < this.hiddenSize; j++) {
          hidden[j] = sigmoid(dot(this.weightsInputHidden[j], inputWithBias));
        }
        const hiddenWithBias = addBias(hidden);
        const output = sigmoid(dot(this.weightsHiddenOutput, hiddenWithBias));

        const outputError = target - output;
        totalLoss += outputError * outputError;

        // Backward pass
        const outputDelta = outputError * sigmoidDerivative(output);

        const hiddenDeltas = new Float32Array(this.hiddenSize + 1);
        for (let j = 0; j <= this.hiddenSize; j++) {
          hiddenDeltas[j] =
            this.weightsHiddenOutput[j] * outputDelta * sigmoidDerivative(hiddenWithBias[j]);
        }

        // Update hidden → output weights
        for (let j = 0; j <= this.hiddenSize; j++) {
          this.weightsHiddenOutput[j] += lr * outputDelta * hiddenWithBias[j];
        }

        // Update input → hidden weights
        for (let j = 0; j < this.hiddenSize; j++) {
          for (let k = 0; k < this.inputSize; k++) {
            this.weightsInputHidden[j][k] += lr * hiddenDeltas[j] * inputWithBias[k];
          }
        }
      }

      // Early stopping check co progressInterval epok
      if ((epoch + 1) % progressInterval === 0) {
        const avgLoss = totalLoss / inputs.length;
        onProgress?.(epoch + 1, avgLoss);

        if (bestLoss - avgLoss < earlyStoppingThreshold) {
          patienceCounter++;
          if (patienceCounter >= earlyStoppingPatience) break;
        } else {
          bestLoss = avgLoss;
          patienceCounter = 0;
        }
      }
    }
  }
}

export function neuralNetworkFactory() {
  const nn = new NeuralNetwork(9, 10);
  return {
    predict(input: number[]): number {
      return nn.predict(input);
    },
    setWeights(weights: SerializedWeights): void {
      nn.setWeights(weights);
    },
  };
}
