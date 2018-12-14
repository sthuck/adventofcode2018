import {expect} from 'chai';
import {parseLine, addClaimToFabric, createFabric, howManyOverLapping} from './index';

describe('day3', () => {
  it('parse', () => {
    expect(parseLine('#123 @ 3,2: 5x4')).to.deep.eq({id: 123, left: 3, top: 2, width: 5, height: 4});
  });

  it('addclaim', () => {
    const fabric = createFabric(8, 8);
    const claim = parseLine('#123 @ 3,2: 5x4');
    addClaimToFabric(claim, fabric);
    expect(fabric.matrix[4][3]).to.deep.eq([123]);
  });

  it('howmanyoverlapping', () => {
    const lines = `#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2`.split('\n');
    const claims = lines.map(parseLine);
    const fabric = createFabric(8, 8);
    claims.forEach(claim => addClaimToFabric(claim, fabric));
    expect(howManyOverLapping(fabric)).to.eq(4);
  });
});

describe('part2', () => {
  it('mentain valid claim set', () => {
      const fabric = createFabric(8, 8);
      const claim = parseLine('#123 @ 3,2: 5x4');
      addClaimToFabric(claim, fabric);
      expect(fabric.matrix[4][3]).to.deep.eq([123]);
      expect(fabric.validClaims.has(123)).to.eq(true);
  });

  it('remove from valid claim set on collisun', () => {
      const fabric = createFabric(8, 8);
      const claim = parseLine('#123 @ 3,2: 5x4');
      const claim2 = parseLine('#124 @ 4,3: 2x2');
      addClaimToFabric(claim, fabric);
      addClaimToFabric(claim2, fabric);
      expect(fabric.validClaims.has(123)).to.eq(false);
  });
});