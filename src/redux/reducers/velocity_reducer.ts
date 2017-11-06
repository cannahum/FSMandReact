import { VelocityActionTypes, VelocityActions } from '../actions/velocity_actions';
import { Reducer } from 'redux';

export interface VelocityState {
  velocity: number;
  enginePowerFactor: number;
}

const initialState: VelocityState = {
  velocity: 0,
  enginePowerFactor: 1
}

const velocityReducer: Reducer<VelocityState> = (oldState: VelocityState = initialState, action: any): VelocityState => {
  switch (action.type) {
    case VelocityActions.ACCELERATE: {
      return Object.assign(oldState, {
        velocity: oldState.velocity + (action.delta * oldState.enginePowerFactor)
      });
    }
    case VelocityActions.DECELERATE: {
      return Object.assign(oldState, {
        velocity: oldState.velocity - (action.delta * oldState.enginePowerFactor)
      });
    }
    case VelocityActions.ENGINE: {
      return Object.assign(oldState, {
        enginePowerFactor: action.newFactor
      });
    }
    default: {
      return oldState;
    }
  }
}

export default velocityReducer;