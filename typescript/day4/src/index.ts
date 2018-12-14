import {maxBy, inRange} from 'lodash';

interface LineDataBase {
  dateStr: string;
  minute: number;
}

enum StateTypes {
  FALLS_ASLLEP = 'falls asleep',
  WAKES_UP = 'wakes up',
  BEGIN = 'begin'
}


interface BeginEvent extends LineDataBase {
  type: StateTypes.BEGIN,
  id: number
}
interface SleepEvent extends LineDataBase {
  type: StateTypes.FALLS_ASLLEP
}
interface WakeupEvent extends LineDataBase {
  type: StateTypes.WAKES_UP
}

type LineEvent = BeginEvent | SleepEvent | WakeupEvent;

const regex = /\[([\d\- \:]*)\] (.*)/;
const minuteRegex = /\:(\d+)$/;


export const parse = (line: string): LineEvent => {
  const match = regex.exec(line);
  if (match) {
    const [, dateStr, eventStr] = match;
    const minute = parseInt((minuteRegex.exec(dateStr) as any)[1]);

    if (eventStr === StateTypes.FALLS_ASLLEP) {
      const type = StateTypes.FALLS_ASLLEP;
      return {type, minute, dateStr};
    } else if (eventStr === StateTypes.WAKES_UP) {
      const type = StateTypes.WAKES_UP;
      return {type, minute, dateStr};
    } else {
      const type = StateTypes.BEGIN;
      const id = parseInt(eventStr.replace(/[a-zA-Z \#]*/g, ''));
      return {dateStr, minute, type, id};
    }
  }
  throw "bad parsing";
}
type Id = number;

interface State {
  currentId: number;
  falledAsleep: number;
  sleepSchedule: Map<Id, Array<[number, number]>>
}

const isValidState = (event: LineEvent, state: State) => {
  switch (event.type) {
    case StateTypes.BEGIN:
      break;
    case StateTypes.FALLS_ASLLEP:
      if (state.currentId === -1) {
        throw new Error("bad reducer");
      }
      break;
    case StateTypes.WAKES_UP:
      if (state.currentId === -1 || state.falledAsleep === -1) {
        throw new Error("bad reducer");
      }
      break;
    default:
  }
}

const mostAsleepReducer = (event: LineEvent, state: State): State => {
  isValidState(event, state);
  switch (event.type) {
    case StateTypes.BEGIN:
      state.currentId = event.id;
      break;
    case StateTypes.FALLS_ASLLEP:
      state.falledAsleep = event.minute;
      break;
    case StateTypes.WAKES_UP:
      const schedule = state.sleepSchedule.get(state.currentId) || [];
      state.sleepSchedule.set(state.currentId, [...schedule, [state.falledAsleep, event.minute]]);
      state.falledAsleep = -1;
      break;
    default:
  }
  return state
}

const findMostCommonMinute = (schedule: [number, number][]) => {
  const startingMinutes = schedule.map(([start, stop]) => start);
  const minutesAndCount = startingMinutes.map(minute => {
    const wasInHowManySleeps = schedule.reduce((sum, [start, stop]) => sum + (inRange(minute, start, stop) ? 1 : 0), 0);
    return {minute, wasInHowManySleeps};
  });
  const mostCommonMinute = maxBy(minutesAndCount, item => item.wasInHowManySleeps);
  return mostCommonMinute;
}

export const buildState = (input: LineEvent[]) => {
  let state: State = {
    currentId: -1,
    falledAsleep: -1,
    sleepSchedule: new Map()
  }
  input.forEach(event => {
    state = mostAsleepReducer(event, state);
  });
  return state;
}

//Strategy1
export const mostAsleep = (state: State) => {
  const minutesAsleepPerGuard: {id: Id, minutes: number}[] = []
  for (const [id, schedule] of state.sleepSchedule.entries()) {
    const minutes = schedule.reduce((sum, [start, stop]) => sum + (stop - start), 0);
    minutesAsleepPerGuard.push({id, minutes});
  }
  const mostAsleepGuard = maxBy(minutesAsleepPerGuard, item => item.minutes);
  const maxSleepSchedule = state.sleepSchedule.get(mostAsleepGuard!.id);
  const mostCommonMinute = findMostCommonMinute(maxSleepSchedule!);
  return {mostCommonMinute, mostAsleepGuard};
}

//Strategy2
export const mostCommonAsleep = (state: State) => {
  const commonMinutePerGuard: {id: Id, minute: {minute: number, wasInHowManySleeps: number}}[] = [];

  for (const [id, schedule] of state.sleepSchedule.entries()) {
    const minute = findMostCommonMinute(schedule);
    commonMinutePerGuard.push({id, minute: minute!});
  }
  const mostAsleepGuard = maxBy(commonMinutePerGuard, item => item.minute.wasInHowManySleeps);
  return mostAsleepGuard;
}
