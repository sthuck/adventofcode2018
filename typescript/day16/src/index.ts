import {isEqual, invert} from 'lodash';
type Registers = Record<number, number>;

interface Action {
  (a: number, b: number, c: number): (r: Registers) => (Registers)
}
type Instruction = [number, number, number, number];

const actions: Record<string, Action> = {
  addr: (a, b, c) => r => ({...r, [c]: r[a] + r[b]}),
  addi: (a, b, c) => r => ({...r, [c]: r[a] + b}),
  mulr: (a, b, c) => r => ({...r, [c]: r[a] * r[b]}),
  muli: (a, b, c) => r => ({...r, [c]: r[a] * b}),
  banr: (a, b, c) => r => ({...r, [c]: r[a] & r[b]}),
  bani: (a, b, c) => r => ({...r, [c]: r[a] & b}),
  borr: (a, b, c) => r => ({...r, [c]: r[a] | r[b]}),
  bori: (a, b, c) => r => ({...r, [c]: r[a] | b}),
  setr: (a, b, c) => r => ({...r, [c]: r[a]}),
  seti: (a, b, c) => r => ({...r, [c]: a}),
  gtir: (a, b, c) => r => ({...r, [c]: a > r[b] ? 1 : 0}),
  gtri: (a, b, c) => r => ({...r, [c]: r[a] > b ? 1 : 0}),
  gtrir: (a, b, c) => r => ({...r, [c]: r[a] > r[b] ? 1 : 0}),
  eqir: (a, b, c) => r => ({...r, [c]: a === r[b] ? 1 : 0}),
  eqri: (a, b, c) => r => ({...r, [c]: r[a] === b ? 1 : 0}),
  eqrr: (a, b, c) => r => ({...r, [c]: r[a] === r[b] ? 1 : 0}),
}
const actionNames = Object.keys(actions);

const sum = <T>(arr: Array<T>, how: (t: T) => number = (item: T) => (item as any)) => arr.reduce((sum, item) => sum + how(item), 0);
interface StateChange {
  before: Registers,
  after: Registers,
  instruction: Instruction
}

export const parse = (lines: string[]): StateChange[] => {
  const assertions: StateChange[] = [];
  let i = 0;
  while (i < lines.length) {
    const before: Registers = {...lines[i++].replace(/[^\d,]/g, '').split(',').map(s => parseInt(s, 10))};
    const instruction: Instruction = lines[i++].split(' ').map(s => parseInt(s, 10)) as Instruction;
    const after: Registers = {...lines[i++].replace(/[^\d,]/g, '').split(',').map(s => parseInt(s, 10))};
    assertions.push({before, instruction, after});
    i++; //emptry line;
  }
  return assertions;
}
const doesActionMatchStateChange = (action: Action, stateChange: StateChange) => {
  const [opcode, ...params] = stateChange.instruction;
  return isEqual(action(...params)(stateChange.before), stateChange.after)
}

export const howManyActionsMatch = (stateChange: StateChange) =>
  sum(Object.keys(actions), actionName =>
    doesActionMatchStateChange(actions[actionName], stateChange) ? 1 : 0)

export const task1 = (input: string[]) => {
  const stateChanges = parse(input);
  return sum(stateChanges, stateChange => howManyActionsMatch(stateChange) >= 3 ? 1 : 0);
}

export const allMatchingActions = (stateChange: StateChange, possibleActions: string[]) => {
  const {after, before, instruction} = stateChange;
  const [opcode, ...params] = instruction;
  return possibleActions.filter(actionName => {
    const action = actions[actionName];
    return isEqual(action(...params)(before), after);
  });
}

const mapActionToOpcode = (stateChanges: StateChange[]) => {
  const actionToOpcodeMap: Record<string, number> = {};
  let possibleActions = actionNames.filter(actionName => !Object.keys(actionToOpcodeMap).includes(actionName));
  while (possibleActions.length) {
    for (const stateChange of stateChanges) {
      const matchingActions = allMatchingActions(stateChange, possibleActions);
      if (matchingActions.length === 1) {
        actionToOpcodeMap[matchingActions[0]] = stateChange.instruction[0];
        break;
      }
    }
    possibleActions = actionNames.filter(actionName => !Object.keys(actionToOpcodeMap).includes(actionName));
  }
  return actionToOpcodeMap;
}
const parsePart2 = (input: string[]) => {
  return input.map(line => line.split(' ').map(s => parseInt(s, 10)) as Instruction)
}
export const task2 = (input: string[], input2: string[]) => {
  const stateChanges = parse(input);
  const actionToOpcodeMap: Record<string, number> = mapActionToOpcode(stateChanges);
  const opcodeToActionMap: Record<number, string> = invert(actionToOpcodeMap);
  const instructions = parsePart2(input2);

  let registers: Registers = {0: 0, 1: 0, 2: 0, 3: 0};
  instructions.forEach(instruction => {
    const [opcode, ...params] = instruction;
    const actionName = opcodeToActionMap[opcode];
    const action = actions[actionName];
    registers = action(...params)(registers)
  });
  return registers;
}