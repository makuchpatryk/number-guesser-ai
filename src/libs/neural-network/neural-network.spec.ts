import { expect, describe, beforeAll, it } from 'vitest';
import { NeuralNetwork, defaultTrainingConfig } from './neural-network.ts';

describe('NeuralNetwork XOR Test', () => {
  const nn = new NeuralNetwork(9, 10);
  const data = [
    { input: [0, 1, 0, 0, 1, 0, 0, 1, 0], target: 1 },
    { input: [1, 1, 1, 1, 0, 1, 1, 1, 1], target: 0 },
    { input: [0, 1, 0, 1, 0, 1, 1, 1, 1], target: 0 },
    { input: [1, 1, 1, 1, 0, 1, 0, 1, 0], target: 0 },
    { input: [0, 1, 0, 1, 0, 1, 0, 1, 0], target: 0 },
    { input: [1, 0, 0, 1, 0, 0, 1, 0, 0], target: 1 },
    { input: [1, 0, 0, 1, 0, 0, 0, 0, 0], target: 1 },
    { input: [0, 0, 1, 0, 0, 1, 0, 0, 0], target: 1 },
    { input: [0, 0, 0, 0, 0, 1, 0, 0, 1], target: 1 },
    { input: [0, 0, 0, 0, 1, 0, 0, 1, 0], target: 1 },
    { input: [0, 0, 0, 1, 0, 0, 1, 0, 0], target: 1 },
    { input: [0, 1, 0, 0, 1, 0, 0, 0, 0], target: 1 },
    { input: [0, 1, 1, 0, 1, 1, 0, 1, 1], target: 0 },
    { input: [1, 1, 0, 0, 1, 0, 1, 1, 1], target: 2 },
    { input: [1, 1, 1, 0, 0, 1, 0, 0, 1], target: 7 },
    { input: [1, 1, 1, 1, 1, 0, 1, 1, 0], target: 6 },
    { input: [0, 1, 1, 0, 1, 1, 0, 0, 1], target: 9 },
    { input: [0, 1, 0, 1, 1, 0, 0, 1, 0], target: 4 },
    { input: [1, 1, 0, 0, 1, 0, 1, 1, 0], target: 3 },
  ];

  beforeAll(() => {
    nn.train(
      data.map((d) => d.input),
      data.map((d) => d.target),
      defaultTrainingConfig,
    );
  });

  it('should output ~0', () => {
    const output = nn.predict([1, 1, 1, 1, 0, 1, 1, 1, 1]);
    console.log('output', output);
    expect(output).toBeLessThan(0.2);
  });

  it('should output ~1', () => {
    const output = nn.predict([0, 1, 0, 0, 1, 0, 0, 1, 0]);
    console.log('output', output);
    expect(output).toBeGreaterThan(0.8);
  });

  it('should output ~1', () => {
    const output = nn.predict([1, 0, 0, 1, 0, 0, 1, 0, 0]);
    console.log('output', output);
    expect(output).toBeGreaterThan(0.8);
  });

  it('should output ~9', () => {
    const output = nn.predict([0, 1, 1, 0, 1, 1, 0, 0, 1]);
    console.log('output', output);
    expect(output).toBeLessThan(9.2);
  });

  it('should output ~3', () => {
    const output = nn.predict([1, 1, 0, 0, 1, 0, 1, 1, 0]);
    console.log('output', output);
    expect(output).toBeLessThan(3.2);
    expect(output).toBeGreaterThan(2.8);
  });
});
