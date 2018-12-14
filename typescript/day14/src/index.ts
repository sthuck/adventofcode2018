import {range, uniqueId, max, isEqual} from 'lodash';

export class CyclicArray<T> {
  private backingArray: Array<T> = [];

  constructor(initialArray: Array<T> = []) {
    this.backingArray = initialArray;
  }

  push(item: T) {
    this.backingArray.push(item);
    return this.backingArray.length;
  }
  set(index: number, item: T) {
    return this.backingArray[this.fixIndex(index)] = item;
  }
  get(index: number) {
    return this.backingArray[this.fixIndex(index)];
  }
  fixIndex(index: number) {
    return index % this.backingArray.length;
  }
  slice(start: number, end: number) {
    return this.backingArray.slice(this.fixIndex(start), end > this.length ? this.fixIndex(end) : end);
  }
  toArray() {
    return this.backingArray;
  }
  get length() {
    return this.backingArray.length;
  }
}

const initialState = () => ({
  cyclicArray: new CyclicArray([3, 7]),
  elv1: 0,
  elv2: 1,
});
type State = ReturnType<typeof initialState>;

const doTick = (state: State): State => {
  let {cyclicArray, elv1, elv2} = state;
  const elv1Recepie = cyclicArray.get(elv1);
  const elv2Recepie = cyclicArray.get(elv2);
  const result = elv1Recepie + elv2Recepie;
  if (result < 10) {
    cyclicArray.push(result);
  } else {
    cyclicArray.push(Math.floor(result / 10));
    cyclicArray.push(result % 10);
  }
  elv2 = cyclicArray.fixIndex(elv2 + 1 + elv2Recepie);
  elv1 = cyclicArray.fixIndex(elv1 + 1 + elv1Recepie);
  return {elv1, elv2, cyclicArray};
}

const drawState = (state: State) => {
  const {cyclicArray, elv1, elv2} = state;
  const a = cyclicArray.slice(0, cyclicArray.length);
  console.log(a.map((n, index) => index === elv1 ? `(${n})` : index === elv2 ? `[${n}]` : ` ${n} `).join(''));
}
export const task1 = (requiredLength: number) => {
  let state = initialState();
  while (state.cyclicArray.length <= requiredLength + 10) {
    drawState(state);
    state = doTick(state);
  }
  const results = state.cyclicArray.slice(requiredLength, requiredLength + 10);
  return results.join('');
}

const findEndingSubString = (array: CyclicArray<number>, input: number[]) => {
  const inputLen = input.length;
  const n = array.length;
  let found = true;
  let base = n - 1 - inputLen;
  for (let i = 0; i < inputLen; i++) {
    found = found && array.get(base + i) === input[i];
  }
  if (found) {
    return n - 1 - inputLen;
  }

  found = true;
  base = n - inputLen;
  for (let i = 0; i < inputLen; i++) {
    found = found && array.get(base + i) === input[i];
  }
  if (found) {
    return n - inputLen;
  }
}

export const task2 = (input: string | number) => {
  const requiredInput = input.toString().split('').map(s => parseInt(s, 10));
  let state = initialState();
  let selcetedIndex;
  while (true) {
    const {cyclicArray} = state;
    selcetedIndex = findEndingSubString(cyclicArray, requiredInput)
    if (selcetedIndex) {
      break;
    }
    state = doTick(state);
  }
  return selcetedIndex;
}
