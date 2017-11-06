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

const pedalReducer: Reducer<PedalState> = (oldState: PedalState = initialState, action: any): PedalState => {
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
        pedal: Pedals.RELEASE,
        throttle: 0,
      }
    }
  }
}

export default pedalReducer;