function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function sigmoidDerivative(x: number): number {
  return x * (1 - x);
}

function dot(a: number[], b: number[]): number {
  return a.reduce((sum, ai, i) => sum + ai * b[i], 0);
}

function addBias(inputs: number[]): number[] {
  return [...inputs, 1]; // bias neuron
}

class NeuralNetwork {
  inputSize: number;
  hiddenSize: number;
  outputSize: number;

  weightsInputHidden: number[][];
  weightsHiddenOutput: number[];

  constructor(inputSize: number, hiddenSize: number) {
    this.inputSize = inputSize + 1; // +1 for bias
    this.hiddenSize = hiddenSize;
    this.outputSize = 1;

    this.weightsInputHidden = Array.from({ length: this.hiddenSize }, () =>
      Array.from({ length: this.inputSize }, () => Math.random() * 2 - 1),
    );

    this.weightsHiddenOutput = Array.from(
      { length: this.hiddenSize + 1 },
      () => Math.random() * 2 - 1,
    );
  }

  predict(input: number[]): number {
    const inputWithBias = addBias(input);
    const hidden = this.weightsInputHidden.map((weights) =>
      sigmoid(dot(weights, inputWithBias)),
    );
    const hiddenWithBias = addBias(hidden);
    const output = sigmoid(dot(this.weightsHiddenOutput, hiddenWithBias));
    return output * 9; // scale back to 0-9
  }

  train(inputs: number[][], targets: number[], epochs = 10000, lr = 0.1) {
    for (let epoch = 0; epoch < epochs; epoch++) {
      inputs.forEach((input, i) => {
        const target = targets[i] / 9; // normalize target

        const inputWithBias = addBias(input);
        const hidden = this.weightsInputHidden.map((weights) =>
          sigmoid(dot(weights, inputWithBias)),
        );
        const hiddenWithBias = addBias(hidden);
        const output = sigmoid(dot(this.weightsHiddenOutput, hiddenWithBias));

        const outputError = target - output;
        const outputDelta = outputError * sigmoidDerivative(output);

        const hiddenErrors = this.weightsHiddenOutput.map(
          (w) => w * outputDelta,
        );
        const hiddenDeltas = hiddenWithBias.map(
          (h, i) => hiddenErrors[i] * sigmoidDerivative(h),
        );

        // Update weights for hidden to output
        for (let j = 0; j < this.weightsHiddenOutput.length; j++) {
          this.weightsHiddenOutput[j] += lr * outputDelta * hiddenWithBias[j];
        }

        // Update weights for input to hidden
        for (let j = 0; j < this.hiddenSize; j++) {
          for (let k = 0; k < this.inputSize; k++) {
            this.weightsInputHidden[j][k] +=
              lr * hiddenDeltas[j] * inputWithBias[k];
          }
        }
      });
    }
  }
}

export function neuralNetworkFactory() {
  const nn = new NeuralNetwork(9, 10);
  return {
    train(data: { input: number[]; target: number }[]) {
      const inputs: number[][] = [];
      const targets: number[] = [];

      data.forEach((it) => {
        inputs.push(it.input);
        targets.push(it.target);
      });
      nn.train(inputs, targets, 300000);
    },
    predict(input: number[]) {
      return nn.predict(input);
    },
  };
}
