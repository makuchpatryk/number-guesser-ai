import { expect, describe, beforeAll, it } from 'vitest';
import { NeuralNetwork } from './neural-network.ts';

describe('NeuralNetwork XOR Test', () => {
  const nn = new NeuralNetwork(2, 2, 1, 0.1);
  const inputs = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ];
  const targets = [0, 1, 1, 0];

  beforeAll(() => {
    nn.train(inputs, targets, 100000);
    inputs.forEach((input) => {
      const result = nn.forward(input).output;
      console.log(`Input: ${input} => Output: ${result.toFixed(3)}`);
    });
  });

  it('should output ~0 for [0, 0]', () => {
    const output = nn.forward([0, 0]).output;
    expect(output).toBeLessThan(0.2);
  });

  it('should output ~1 for [0, 1]', () => {
    const output = nn.forward([0, 1]).output;
    expect(output).toBeGreaterThan(0.8);
  });

  it('should output ~1 for [1, 0]', () => {
    const output = nn.forward([1, 0]).output;
    expect(output).toBeGreaterThan(0.8);
  });

  it('should output ~0 for [1, 1]', () => {
    const output = nn.forward([1, 1]).output;
    expect(output).toBeLessThan(0.2);
  });
});
