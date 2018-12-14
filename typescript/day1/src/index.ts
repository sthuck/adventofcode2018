
export const parseLine = (line: string): number =>
  parseInt(line, 10);

export const applyFrequencies = (start: number, input: string[]) =>
  input
  .map(parseLine)
  .reduce((result, currChange) => result + currChange, start);

export const findDuplicateFreq = (start: number, input: string[]) => {
  const frequencies = input.map(parseLine);
  
  const hasBeen = new Set<Number>();
  let currentValue = start;
  let index = 0;
  while (!hasBeen.has(currentValue)) {
    hasBeen.add(currentValue);
    currentValue += frequencies[index % frequencies.length];
    index++;
  }
  return currentValue;
}