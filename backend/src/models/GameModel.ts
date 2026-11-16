export const GameModel = {
  validateChestUnlock(expected: number[], actual: number[]): boolean {
    return expected.length === actual.length && expected.every((value, index) => value === actual[index]);
  },
};
