import { VelocityActionTypes, VelocityActions, GAS_ENGINE_POWER } from '../actions/velocity_actions';
import { EngineMode, EngineActionTypes } from '../actions/engine_actions';
import { Reducer } from 'redux';

export interface VelocityState {
  velocity: number;
  enginePowerFactor: number;
  engineMode: EngineMode;
}

const initialState: VelocityState = {
  velocity: 0,
  enginePowerFactor: GAS_ENGINE_POWER,
  engineMode: EngineMode.CHARGING
}

const velocityReducer: Reducer<VelocityState> = (oldState: VelocityState = initialState, action: any): VelocityState => {
  switch (action.type) {
    case VelocityActions.ACCELERATE: {
      return Object.assign({}, oldState, {
        velocity: Math.min(100, oldState.velocity + (action.delta * oldState.enginePowerFactor))
      });
    }
    case VelocityActions.DECELERATE: {
      return Object.assign({}, oldState, {
        velocity: Math.max(0, action.fullStop === true ? 0 : oldState.velocity - (action.delta * oldState.enginePowerFactor))
      });
    }
    case VelocityActions.ENGINE: {
      return Object.assign({}, oldState, {
        enginePowerFactor: action.newFactor,
        engineMode: action.engineMode,
      });
    }
    default: {
      return oldState;
    }
  }
}

export default velocityReducer;