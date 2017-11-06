import { combineReducers } from 'redux';
import pedalReducer, { PedalState } from './pedal_reducer';
import velocityReducer, { VelocityState } from './velocity_reducer';

export interface ReducerMap {
  pedalReducer: PedalState;
  velocityReducer: VelocityState;
}

const rootReducer = combineReducers<ReducerMap>({
  pedalReducer,
  velocityReducer
});

export default rootReducer;
