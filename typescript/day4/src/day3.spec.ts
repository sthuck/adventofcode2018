import {expect} from 'chai';
import {parse, mostAsleep, buildState, mostCommonAsleep} from './index';

describe('day4', () => {
  describe('parse', () => {
    it('parse begin', () => {
      const str = `[1518-11-01 23:58] Guard #99 begins shift`;
      expect(parse(str)).to.deep.eq({
        dateStr: "1518-11-01 23:58",
        id: 99,
        minute: 58,
        type: "begin",
      });
    });

    it('parse sleep', () => {
      const str = `[1518-11-06 00:02] falls asleep`;
      expect(parse(str)).to.deep.eq({
        dateStr: "1518-11-06 00:02",
        minute: 2,
        type: "falls asleep",
      });
    });

    it('wakes up', () => {
      const str = `[1518-11-02 00:50] wakes up`;
      expect(parse(str)).to.deep.eq({
        dateStr: "1518-11-02 00:50",
        minute: 50,
        type: "wakes up",
      });
    });
  });

  describe('most asleep', () => {
    it('most asleep', () => {
      const events = `[1518-11-01 00:00] Guard #10 begins shift
    [1518-11-01 00:05] falls asleep
    [1518-11-01 00:25] wakes up
    [1518-11-01 00:30] falls asleep
    [1518-11-01 00:55] wakes up
    [1518-11-01 23:58] Guard #99 begins shift
    [1518-11-02 00:40] falls asleep
    [1518-11-02 00:50] wakes up
    [1518-11-03 00:05] Guard #10 begins shift
    [1518-11-03 00:24] falls asleep
    [1518-11-03 00:29] wakes up
    [1518-11-04 00:02] Guard #99 begins shift
    [1518-11-04 00:36] falls asleep
    [1518-11-04 00:46] wakes up
    [1518-11-05 00:03] Guard #99 begins shift
    [1518-11-05 00:45] falls asleep
    [1518-11-05 00:55] wakes up`.split('\n').map(s => s.trim()).map(parse);
      const state = buildState(events);
      const max = mostAsleep(state);
      expect(max).to.deep.eq({
        mostAsleepGuard: {id: 10, minutes: 50},
        mostCommonMinute: {
          minute: 24,
          wasInHowManySleeps: 2
        }
      });
    });
  });
  it ('most common', () => {
    const events = `[1518-11-01 00:00] Guard #10 begins shift
    [1518-11-01 00:05] falls asleep
    [1518-11-01 00:25] wakes up
    [1518-11-01 00:30] falls asleep
    [1518-11-01 00:55] wakes up
    [1518-11-01 23:58] Guard #99 begins shift
    [1518-11-02 00:40] falls asleep
    [1518-11-02 00:50] wakes up
    [1518-11-03 00:05] Guard #10 begins shift
    [1518-11-03 00:24] falls asleep
    [1518-11-03 00:29] wakes up
    [1518-11-04 00:02] Guard #99 begins shift
    [1518-11-04 00:36] falls asleep
    [1518-11-04 00:46] wakes up
    [1518-11-05 00:03] Guard #99 begins shift
    [1518-11-05 00:45] falls asleep
    [1518-11-05 00:55] wakes up`.split('\n').map(s => s.trim()).map(parse);
      const state = buildState(events);
    const max = mostCommonAsleep(state);
    expect(max).to.deep.eq({id: 99, minute: {minute: 45, wasInHowManySleeps: 3}});
  });
});