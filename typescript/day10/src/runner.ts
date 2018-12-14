import * as fs from 'fs';
import * as path from 'path';
import {createConsoleCanvas, drawConsoleCanvas, parse, resetScreen, updatePoint, findBestIteration} from './index';
import {sumBy} from 'lodash';
const demoInput = `position=< 9,  1> velocity=< 0,  2>
position=< 7,  0> velocity=<-1,  0>
position=< 3, -2> velocity=<-1,  1>
position=< 6, 10> velocity=<-2, -1>
position=< 2, -4> velocity=< 2,  2>
position=<-6, 10> velocity=< 2, -2>
position=< 1,  8> velocity=< 1, -1>
position=< 1,  7> velocity=< 1,  0>
position=<-3, 11> velocity=< 1, -2>
position=< 7,  6> velocity=<-1, -1>
position=<-2,  3> velocity=< 1,  0>
position=<-4,  3> velocity=< 2,  0>
position=<10, -3> velocity=<-1,  1>
position=< 5, 11> velocity=< 1, -2>
position=< 4,  7> velocity=< 0, -1>
position=< 8, -2> velocity=< 0,  1>
position=<15,  0> velocity=<-2,  0>
position=< 1,  6> velocity=< 1,  0>
position=< 8,  9> velocity=< 0, -1>
position=< 3,  3> velocity=<-1,  1>
position=< 0,  5> velocity=< 0, -1>
position=<-2,  2> velocity=< 2,  0>
position=< 5, -2> velocity=< 1,  2>
position=< 1,  4> velocity=< 2,  1>
position=<-2,  7> velocity=< 2, -2>
position=< 3,  6> velocity=<-1, -1>
position=< 5,  0> velocity=< 1,  0>
position=<-6,  0> velocity=< 2,  0>
position=< 5,  9> velocity=< 1, -2>
position=<14,  7> velocity=<-2,  0>
position=<-3,  6> velocity=< 2, -1>`.split('\n');
const readFile = (filename: string): string[] =>
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('\n');
const sleep = (n: number) => new Promise(resolve => setTimeout(resolve, n));

const day10_1And2 = async () => {
  // let points = demoInput.map(parse);
  let points = readFile('input').map(parse);
  const bestIteration = findBestIteration(points, 20000);
  points = readFile('input').map(parse);
  findBestIteration(points, bestIteration);
  drawConsoleCanvas(createConsoleCanvas(points));
  console.log(bestIteration);
}


day10_1And2();