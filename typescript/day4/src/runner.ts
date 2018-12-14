import * as fs from 'fs';
import * as path from 'path';
import {mostAsleep, parse, buildState, mostCommonAsleep} from './index';

const readFile = (filename: string): string[] => 
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('\n');

const day4_1 = () => {
  const lines = readFile('input');
  const events = lines.map(parse).sort((a, b) => a.dateStr.localeCompare(b.dateStr));
  const state = buildState(events);
  const most = mostAsleep(state);
  console.log(most);
}

const day4_2 = () => {
  const lines = readFile('input');
  const events = lines.map(parse).sort((a, b) => a.dateStr.localeCompare(b.dateStr));
  const state = buildState(events);
  const most = mostCommonAsleep(state);
  console.log(most);
}


day4_2();