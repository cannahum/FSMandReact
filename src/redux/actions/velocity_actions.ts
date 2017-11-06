import { Action, Dispatch } from 'redux';

export enum VelocityActions {
  ACCELERATE = 'ACCELERATE',
  DECELERATE = 'DECELERATE',
  ENGINE = 'ENGINE'
}

export type VelocityActionTypes = AccelerateAction | DecelerateAction | EnginePowerChange;
interface AccelerateAction extends Action {
  readonly type: VelocityActions.ACCELERATE;
  delta: number;
}

interface DecelerateAction extends Action {
  readonly type: VelocityActions.DECELERATE;
  delta: number;
}

interface EnginePowerChange extends Action {
  readonly type: VelocityActions.ENGINE;
  newFactor: number;
}

export function accelerate(): AccelerateAction {
  return {
    type: VelocityActions.ACCELERATE,
    delta: 1
  }
}

export function decelerate(): DecelerateAction {
  return {
    type: VelocityActions.DECELERATE,
    delta: 1
  }
}

export function changeEngine(newFactor: number): EnginePowerChange {
  return {
    type: VelocityActions.ENGINE,
    newFactor
  }
}