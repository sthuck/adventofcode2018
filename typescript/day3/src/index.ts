import {range} from 'lodash';

export interface Claim {
  id: Id;
  left: number;
  top: number;
  width: number;
  height: number;
}
interface Id extends Number {}

// #2 @ 941,233: 16x14
const regex = /\#(\d+) \@ (\d+),(\d+): (\d+)x(\d+)$/

export const parseLine = (line: string): Claim => {
  const match = regex.exec(line);
  if (match) {
    const [id, left, top, width, height] = match.slice(1, 6).map(s => parseInt(s, 10));
    return {id, left, top, width, height};
  }
  throw Error('bad parsing');
}

type Fabric = {
  matrix: Array<Array<Array<Id>>>;
  validClaims: Set<Id>;
};

export const addClaimToFabric = (claim: Claim, fabric: Fabric) => {
  const {id, left, top, width, height} = claim;
  fabric.validClaims.add(id);

  range(left, left + width)
    .forEach(leftIndex => range(top, top + height)
      .forEach(topIndex => {
        const claimIdArr = fabric.matrix[leftIndex][topIndex];
        claimIdArr.push(id);
        if (claimIdArr.length > 1) {
          claimIdArr.forEach(conflictClaim => fabric.validClaims.delete(conflictClaim));
        }
      }));
  
}

const sum = <T>(arr: Array<T>, how: (t: T) => number = (item: T) => (item as any)) => arr.reduce((sum, item) => sum + how(item), 0);
export const howManyOverLapping = (fabric: Fabric) => {
  return sum(fabric.matrix, (row => sum(row.map(cell => cell.length > 1 ? 1 : 0))));
}

export const printFabric = (fabric: Fabric) => {
  const fabricWithId = fabric.matrix.map(row => row.map(cell => cell.length > 1 ? 'X' : cell.length === 0 ? '.'  : cell[0]));
  console.log(fabricWithId.map(row => row.join('')).join('\n'));
}

export const createFabric = (width: number, height: number): Fabric => {
  return {
    matrix: range(width).map(() => range(height).map(() => [])),
    validClaims: new Set()
  };
}