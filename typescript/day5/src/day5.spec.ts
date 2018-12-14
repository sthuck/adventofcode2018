import {expect} from 'chai';
import {doReaction, findBest} from './index';

describe('day5', () => {
  describe('doReaction', () => {
    it('', () => {
      const test = 'dabAcCaCBAcCcaDA';
      expect(doReaction(test)).to.eq('dabCBAcaDA');
    });
  });

  describe('findBest', () => {
    it('', () => {
      const test = 'dabAcCaCBAcCcaDA';
      expect(findBest(test)).to.eq(4);
    });
  });
});

