import { PedalActionTypes, PedalActions, Pedals } from '../actions/pedal_actions';
import { Reducer } from 'redux';

export interface PedalState {
  pedal: Pedals;
  throttle: number;
}

const initialState: PedalState = {
  throttle: 0,
  pedal: Pedals.BREAK_PEDAL,
}

const hybridReducer: Reducer<PedalState> = (oldState: PedalState, action: PedalActionTypes): PedalState => {
  switch (action.type) {
    case PedalActions.GAS: {
      return {
        pedal: Pedals.GAS_PEDAL,
        throttle: action.throttle,
      }
    }
    case PedalActions.BREAK: {
      return {
        pedal: Pedals.BREAK_PEDAL,
        throttle: action.throttle,
      }
    }
    case PedalActions.RELEASE:
    default: {
      return {
        pedal: Pedals.BREAK_PEDAL,
        throttle: 0,
      }
    }
  }
}

export default hybridReducer;