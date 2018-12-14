import {range, uniqueId, max, isEqual} from 'lodash';
class InfiniteArray<T> {
  constructor(private defaultValue: T) {};
  private mapping: Record<number | string, T> = {};
  private lowestIndex = 0;
  private highestIndex = 0;

  get(index: number) {
    return this.mapping[index] || this.defaultValue;
  }

  set(index: number, value: T) {
    if (index < this.lowestIndex) {
      this.lowestIndex = index;
    }
    if (index > this.highestIndex) {
      this.highestIndex = index;
    }
    return this.mapping[index] = value;
  }

  forEach(fn: (value: T, index: number, arr: this) => void, offset = 0) {
    range(this.lowestIndex - offset, this.highestIndex + 1 + offset).forEach(index => {
      fn(this.get(index), index, this);
    });
  }

  slice(start: number, end: number) {
    return range(start, end).map(i => this.get(i));
  }

  toArray(offset = 0) {
    return range(this.lowestIndex - offset, this.highestIndex + 1 + offset).map(i => this.get(i));
  }

  map(fn: (value: T, index: number, arr: this) => T, offset = 0) {
    const newArray = new InfiniteArray(this.defaultValue);
    range(this.lowestIndex - offset, this.highestIndex + offset + 1).forEach(index => {
      newArray.set(index, fn(this.get(index), index, this))
    });
    return newArray;
  }
}

interface Rule {
  pattern: boolean[];
  result: boolean
}
const strToBoolean = (c: string) => c === '#' ? true : false;

export const parse = (lines: string[]) => {
  let [initialStr, , ...rulesStr] = lines;
  const initialStateTemp = initialStr.replace('initial state: ', '').split('').map(strToBoolean);
  const rules = rulesStr.map(line => {
    const pattern = line.slice(0, 5).split('').map(strToBoolean);
    const result = strToBoolean(line.slice(9, 10))
    return {pattern, result};
  });
  const initialState = initialStateTemp.reduce((inifiniteArray, value, index) => {
    inifiniteArray.set(index, value);
    return inifiniteArray;
  }, new InfiniteArray(false));
  return {initialState, rules};
}

export const doTick = (state: InfiniteArray<boolean>, rules: Rule[]) => {
  const newState = state.map((value, index) => {
    debugger;
    const slice = state.slice(index - 2, index + 3);
    for (const rule of rules) {
      if (isEqual(slice, rule.pattern)) {
        return rule.result;
      }
    }
    return false;
  }, 3);
  return newState;
}

export const sumPlants = (state: InfiniteArray<boolean>) => {
  let sum = 0;
  state.forEach((value, index) => sum += value ? index : 0);
  return sum;
}

// export const task2 = (state: InfiniteArray<boolean>, rules: Rule[], generations = 50000000000) => {
//   const resultsMap = new Map<string, number>();
//   let iteration = 0;
//   let stateInString: string;
//   while (true) {
//     stateInString = state.toArray().map(b => b ? '#' : '.').join('');
//     if (resultsMap.has(stateInString)) {
//       break;
//     }
//     resultsMap.set(stateInString, iteration);
//     state = doTick(state, rules);
//     console.log(iteration);
//     iteration++;
//   }
//   console.log('found loop, current Iteration', iteration, '->', resultsMap.get(stateInString));
//   const firstOccrrence = resultsMap.get(stateInString)!;
//   const loopSize = iteration - firstOccrrence;

//   while (iteration + loopSize < generations) {
//     iteration+=loopSize;
//   }

//   while (iteration < generations) {
//     state = doTick(state, rules);
//     iteration++;
//   }
//   return state;
// }

export const task2 = (state: InfiniteArray<boolean>, rules: Rule[], generations = 50000000000) => {
  let iteration = 0;
  let prevSum = 0;
  let prevDiff = new Array(10).fill(0);
  while (iteration < generations) {
    console.log(iteration, prevDiff);
    const sum = sumPlants(state);
    prevDiff.push(sum - prevSum);
    prevDiff.shift();
    prevSum = sum;
    const allEqual = prevDiff.every(diff => diff === prevDiff[0]);
    if (allEqual) {
      break;
    }
    state = doTick(state, rules);
    iteration++;
  }
  const remainingIterations = generations - iteration;
  const howManyPerIteration = prevDiff[0];
  return prevSum + remainingIterations * howManyPerIteration;
}