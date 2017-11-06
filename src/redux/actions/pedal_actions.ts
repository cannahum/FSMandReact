import { Action, Dispatch } from 'redux';

export enum Pedals {
  RELEASE,
  GAS_PEDAL,
  BREAK_PEDAL,
}

export enum PedalActions {
  RELEASE = 'RELEASE',
  GAS = 'GAS',
  BREAK = 'BREAK',
}

export type PedalActionTypes = GasAction | BreakAction | ReleaseAction;
interface GasAction extends Action {
  readonly type: PedalActions.GAS;
  pedal: Pedals.GAS_PEDAL;
  throttle: number;
}

interface BreakAction extends Action {
  readonly type: PedalActions.BREAK;
  pedal: Pedals.BREAK_PEDAL;
  throttle: number;
}

interface ReleaseAction extends Action {
  readonly type: PedalActions.RELEASE;
}

export function pressTheGas(throttle: number): GasAction {
  return {
    type: PedalActions.GAS,
    pedal: Pedals.GAS_PEDAL,
    throttle
  }
}

export function pressTheBreak(throttle: number): BreakAction {
  return {
    type: PedalActions.BREAK,
    pedal: Pedals.BREAK_PEDAL,
    throttle
  }
}

export function releasePedals(): ReleaseAction {
  return {
    type: PedalActions.RELEASE
  }
}