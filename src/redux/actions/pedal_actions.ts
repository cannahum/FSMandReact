import { Action, Dispatch } from 'redux';
import { ReducerMap } from '../reducers'
import { emitAcceleration, emitBreak, emitRelease } from './engine_actions';

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

export function pressTheGas(throttle: number): any {
  return (dispatch: Dispatch<ReducerMap>) => {
    dispatch(emitAcceleration(throttle));
    dispatch({
      type: PedalActions.GAS,
      pedal: Pedals.GAS_PEDAL,
      throttle
    });
  }
}

export function pressTheBreak(throttle: number): any {
  return (dispatch: Dispatch<ReducerMap>) => {
    dispatch(emitBreak());
    dispatch({
      type: PedalActions.BREAK,
      pedal: Pedals.BREAK_PEDAL,
      throttle
    });
  }
}

export function releasePedals(): any {
  return (dispatch: Dispatch<ReducerMap>) => {
    dispatch({
      type: PedalActions.RELEASE
    });
  }
}