// class NeuralNetwork {
//   private weights: number[][];
//   private biases: number[];
//   private learningRate: number;
//
//   constructor(
//     inputSize: number,
//     hiddenSize: number,
//     outputSize: number,
//     learningRate: number = 0.1,
//   ) {
//     this.learningRate = learningRate;
//
//     // Randomly initialize weights and biases
//     this.weights = [
//       Array.from({ length: hiddenSize }, () => Math.random() * 2 - 1),
//       Array.from({ length: outputSize }, () => Math.random() * 2 - 1),
//     ];
//     this.biases = [Math.random() * 2 - 1, Math.random() * 2 - 1];
//   }
//
//   private sigmoid(x: number): number {
//     return 1 / (1 + Math.exp(-x));
//   }
//
//   private sigmoidDerivative(x: number): number {
//     return x * (1 - x);
//   }
//
//   forward(input: number[]): { hidden: number; output: number } {
//     const hidden = this.sigmoid(
//       input[0] * this.weights[0][0] +
//         input[1] * this.weights[0][1] +
//         this.biases[0],
//     );
//     const output = this.sigmoid(hidden * this.weights[1][0] + this.biases[1]);
//     return { hidden, output };
//   }
//
//   train(inputs: number[][], targets: number[], epochs: number = 10000): void {
//     for (let i = 0; i < epochs; i++) {
//       inputs.forEach((input, idx) => {
//         const { hidden, output } = this.forward(input);
//         const target = targets[idx];
//
//         // Compute error
//         const outputError = target - output;
//         const outputDelta = outputError * this.sigmoidDerivative(output);
//
//         const hiddenError = outputDelta * this.weights[1][0];
//         const hiddenDelta = hiddenError * this.sigmoidDerivative(hidden);
//
//         // Update weights and biases
//         this.weights[1][0] += hidden * outputDelta * this.learningRate;
//         this.biases[1] += outputDelta * this.learningRate;
//
//         this.weights[0][0] += input[0] * hiddenDelta * this.learningRate;
//         this.weights[0][1] += input[1] * hiddenDelta * this.learningRate;
//         this.biases[0] += hiddenDelta * this.learningRate;
//       });
//     }
//   }
// }
//
// // XOR Training Data
// const nn = new NeuralNetwork(2, 2, 1, 0.1);
// const inputs = [
//   [0, 0],
//   [0, 1],
//   [1, 0],
//   [1, 1],
// ];
// const targets = [0, 1, 1, 0];
//
// nn.train(inputs, targets, 10000);
//
// // Test the trained network
// inputs.forEach((input) => {
//   console.log(
//     `Input: ${input} -> Output: ${nn.forward(input).output.toFixed(3)}`,
//   );
// });
