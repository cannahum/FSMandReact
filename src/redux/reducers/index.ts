import { combineReducers } from 'redux';
import pedalReducer, { PedalState } from './pedal_reducer';
// ... other reducers
export interface ReducerMap {
  pedalReducer: PedalState;
}

const rootReducer = combineReducers<ReducerMap>({
  pedalReducer,
});

export default rootReducer;
