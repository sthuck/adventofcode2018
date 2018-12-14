import {range, uniqueId} from 'lodash';

interface Node {
  id: string;
  metadataN: number;
  childrenN: number;
  metadata: number[];
  children: Node[]
}

export const parse = (input: string) =>
  input.split(' ').map(i => parseInt(i, 10));

export const toNodes = (input: number[], startingIndex: number): {node: Node, finishingIndex: number} => {

  let index = startingIndex;
  const childrenN = input[index++];
  const metadataN = input[index++];
  const id = uniqueId();

  const children = range(childrenN).map(() => {
    const {finishingIndex, node} = toNodes(input, index);
    index = finishingIndex;
    return node;
  });

  const metadata = range(metadataN).map(() => input[index++]);
  
  return {finishingIndex: index, node: {id, children, childrenN, metadata, metadataN}};
}

const sum = <T>(arr: Array<T>, how: (t: T) => number = (item: T) => (item as any)) => arr.reduce((sum, item) => sum + how(item), 0);
const sumNumbers = (n: number) => n;

export const sumMetadata = (node: Node): number => sum(node.metadata, sumNumbers) + sum(node.children, sumMetadata);

export const specialSum = (node: Node): number => {
  if (!node.childrenN) {
    return sum(node.metadata, sumNumbers);
  } else {
    const childValues = node.metadata.map(i => {
      const index = i -1;
      const child = node.children[index];
      return child ? specialSum(child) : 0
    });
    return sum(childValues, sumNumbers);
  }
}