export class NeuralNetwork {
  private weightsInputHidden: number[][];
  private weightsHiddenOutput: number[];
  private biasHidden: number[];
  private biasOutput: number;
  private readonly learningRate: number;

  constructor(
    inputSize: number,
    hiddenSize: number,
    _outputSize: number,
    learningRate: number = 0.1,
  ) {
    this.learningRate = learningRate;

    this.weightsInputHidden = Array.from({ length: hiddenSize }, () =>
      Array.from({ length: inputSize }, () => Math.random() * 2 - 1),
    );

    this.weightsHiddenOutput = Array.from(
      { length: hiddenSize },
      () => Math.random() * 2 - 1,
    );

    this.biasHidden = Array.from(
      { length: hiddenSize },
      () => Math.random() * 2 - 1,
    );
    this.biasOutput = Math.random() * 2 - 1;
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  private sigmoidDerivative(x: number): number {
    return x * (1 - x);
  }

  forward(input: number[]): { hidden: number[]; output: number } {
    const hidden = this.weightsInputHidden.map((weights, i) => {
      const sum =
        weights.reduce((acc, w, j) => acc + w * input[j], 0) +
        this.biasHidden[i];
      return this.sigmoid(sum);
    });

    const outputSum =
      hidden.reduce((acc, h, i) => acc + h * this.weightsHiddenOutput[i], 0) +
      this.biasOutput;

    const output = this.sigmoid(outputSum);

    return { hidden, output };
  }

  train(inputs: number[][], targets: number[], epochs: number = 10000): void {
    for (let epoch = 0; epoch < epochs; epoch++) {
      inputs.forEach((input, idx) => {
        const target = targets[idx];

        const { hidden, output } = this.forward(input);

        const outputError = target - output;
        const outputDelta = outputError * this.sigmoidDerivative(output);

        const hiddenDeltas = hidden.map((h, i) => {
          const error = this.weightsHiddenOutput[i] * outputDelta;
          return error * this.sigmoidDerivative(h);
        });

        this.weightsHiddenOutput = this.weightsHiddenOutput.map(
          (w, i) => w + hidden[i] * outputDelta * this.learningRate,
        );
        this.biasOutput += outputDelta * this.learningRate;

        this.weightsInputHidden = this.weightsInputHidden.map((weights, i) =>
          weights.map(
            (w, j) => w + input[j] * hiddenDeltas[i] * this.learningRate,
          ),
        );
        this.biasHidden = this.biasHidden.map(
          (b, i) => b + hiddenDeltas[i] * this.learningRate,
        );
      });
    }
  }
}

const nn = new NeuralNetwork(2, 2, 1, 0.1);

const inputs = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];

const targets = [0, 1, 1, 0]; // XOR

nn.train(inputs, targets, 100000);

// Test
inputs.forEach((input) => {
  const result = nn.forward(input).output;
  console.log(`Input: ${input} => Output: ${result.toFixed(3)}`);
});
