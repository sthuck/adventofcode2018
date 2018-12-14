import {range} from 'lodash';

class Step {
  public inProgress: boolean = false;
  public progress: number = -1;
  public timeRequired: number | undefined = undefined;
  constructor(public id: string, public dependsOn: string[] = [], public done = false) {}
}

export const parse = (input: string[]) => {
  const map = new Map<string, Step>();
  const regex = /Step ([A-Z]) must be finished before step ([A-Z]) can begin./;
  input.forEach(line => {
    const match = regex.exec(line);
    const [, depends, id] = match!;
    const step = map.get(id) || new Step(id);
    if (!map.get(depends)) {
      map.set(depends, new Step(depends));
    }
    step.dependsOn.push(depends);
    map.set(id, step);
  });
  return map;
}
type StepMap = Map<string, Step>;

const canStart = (id: string, stepMap: StepMap) => {
  return stepMap.get(id)!.dependsOn.every(stepId => stepMap.get(stepId)!.done);
}

export const task1 = (stepMap: StepMap) => {
  const order: string[] = [];
  let keys = [...stepMap.keys()].sort();
  const length = keys.length;
  while (order.length < length) {
    for (const [, key] of keys.entries()) {
      if (canStart(key, stepMap)) {
        stepMap.get(key)!.done = true;
        order.push(key);
        keys = keys.filter(id => id !== key);
        break;
      }
    }
  }
  return order.join('');
}

const computeTimeRequired = (step: Step, base: number) => {
  step.timeRequired = base + (step.id.charCodeAt(0) - 'A'.charCodeAt(0));
}

class Worker {
  public step?: Step;
  constructor(public id: number) {}
}
const isWorkerFree = (worker: Worker) => !worker.step;
const isDone = (step: Step) => step.timeRequired === step.progress;
const isInProgrees = (step: Step) => step.inProgress;

export const task2 = (stepMap: StepMap, base: number, workersNumber: number) => {
  stepMap.forEach(step => computeTimeRequired(step, base));
  const workers = range(workersNumber).map(i => new Worker(i));
  const done: Step[] = [];
  let keys = [...stepMap.keys()].sort();
  const length = keys.length;
  
  let ticks = 0;

  while (length !== done.length) {
    assignWorkers(workers, keys, stepMap);
    workers.forEach(worker => {
      if (worker.step) {
        worker.step.progress++;
        if (isDone(worker.step)) {
          worker.step.done = true;
          done.push(worker.step);
          worker.step = undefined;
        }
      }
    });
    ticks++;
  }
  
  return ticks;
}

function assignWorkers(workers: Worker[], keys: string[], stepMap: Map<string, Step>) {
  workers.filter(isWorkerFree).forEach(worker => {
    keys.some(key => {
      const step = stepMap.get(key);
      if (step && !isDone(step) && !isInProgrees(step) && canStart(step.id, stepMap)) {
        worker.step = step;
        step.inProgress = true;
        return true;
      }
      return false;
    });
  });
}
