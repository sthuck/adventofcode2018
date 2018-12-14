import * as fs from 'fs';
import * as path from 'path';
import {buildGrid, findBestSquare, findBestSquareWithSize} from './index';

const readFile = (filename: string): string =>
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8');

const day11_1 = () => {
  const {x, y} = findBestSquare(buildGrid(300, 3031));
  console.log(x+1, y+1);
}

const day11_2 = () => {
  const {x, y, squareSize, power} = findBestSquareWithSize(buildGrid(300, 3031));
  console.log(x, y, squareSize, power);
}

day11_2();