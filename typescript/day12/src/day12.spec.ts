import {expect} from 'chai';
import {doTick, parse, sumPlants} from './index';
import {range} from 'lodash';

describe('day12', () => {
  it('', () => {
    const input = `initial state: #..#.#..##......###...###

...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #`.split('\n');
    const {initialState, rules} = parse(input);
    let state = initialState;
    range(20).forEach(() => {
      debugger;
      state = doTick(state, rules);
    });
    expect(sumPlants(state)).equal(325);
  })
});