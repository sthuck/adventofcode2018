import * as fs from 'fs';
import * as path from 'path';
import {range} from 'lodash';
import {doTick, parse, sumPlants, task2} from './index';

const readFile = (filename: string): string =>
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');

const day12_1 = () => {
  const input = readFile('input').split('\n');
  const {initialState, rules} = parse(input);
  let state = initialState;
  range(20).forEach(() => {
    debugger;
    state = doTick(state, rules);
  });
  console.log(sumPlants(state));
}

const day12_2 = () => {
  const input = readFile('input').split('\n');
  const {initialState, rules} = parse(input);
  console.log(task2(initialState, rules));
}

day12_2();