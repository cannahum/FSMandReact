import { Action, Dispatch } from 'redux';
import { EngineMode } from './engine_actions';
import { ReducerMap } from '../reducers'

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
  fullStop: boolean;
}

interface EnginePowerChange extends Action {
  readonly type: VelocityActions.ENGINE;
  newFactor: number;
  engineMode: EngineMode;
}

export const GAS_ENGINE_POWER = 2;
export const EV_ENGINE_POWER = 1;

const getEnginePowerFromEngineMode = (engineMode: EngineMode): 1 | 2 => {
  switch (engineMode) {
    case EngineMode.CHARGING:
    case EngineMode.EV: {
      return EV_ENGINE_POWER;
    }
    case EngineMode.GAS: {
      return GAS_ENGINE_POWER;
    }
    default: {
      throw Error('Unknown Engine Mode: ' + engineMode);
    }
  }
}


export function accelerate(): any {
  return (dispatch: Dispatch<ReducerMap>) => {
    setTimeout(() => {
      dispatch({
        type: VelocityActions.ACCELERATE,
        delta: 1
      });
    }, 300);
  }
}

export function decelerate(fullStop: boolean = false): any | DecelerateAction {
  return (dispatch: Dispatch<ReducerMap>) => {
    setTimeout(() => {
      dispatch({
        type: VelocityActions.DECELERATE,
        delta: 1,
        fullStop
      });
    }, 300);
  }
}


export function changeEngine(engine: EngineMode): EnginePowerChange {
  return {
    type: VelocityActions.ENGINE,
    engineMode: engine,
    newFactor: getEnginePowerFromEngineMode(engine)
  }
}