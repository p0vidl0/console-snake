import { mul } from './index';

describe('Test Multiplication', () => {
  it('Works fine', () => {
    const result = mul(34, 23);
    const expected = 782;
    expect(result).toEqual(expected);
  });
});
