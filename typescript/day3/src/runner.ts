import * as fs from 'fs';
import * as path from 'path';
import {parseLine, addClaimToFabric, createFabric, howManyOverLapping} from './index';

const readFile = (filename: string): string[] => 
  fs.readFileSync(path.resolve(__dirname, filename), 'utf-8').split('\n');

const day3_1 = () => {
  const input = readFile('./input');
  const claims = input.map(parseLine);
  const fabric = createFabric(1000, 1000);
  claims.forEach(claim => addClaimToFabric(claim, fabric));
  console.log(howManyOverLapping(fabric));
}

const day3_2 = () => {
  const input = readFile('./input');
  const claims = input.map(parseLine);
  const fabric = createFabric(1000, 1000);
  claims.forEach(claim => addClaimToFabric(claim, fabric));
  console.log([...fabric.validClaims.values()]);
}


day3_2();