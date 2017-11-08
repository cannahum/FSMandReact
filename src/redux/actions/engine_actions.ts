import { Action, Dispatch } from 'redux';
import { changeEngine, VelocityActions } from './velocity_actions';
import { ReducerMap } from '../reducers'
import FiniteCanMachine, { Transition, DeciderFunction } from '../../fsm';

export enum FSMStates {
  CHARGING = 'charging',
  EV = 'electric',
  GAS = 'gas'
}

enum FSMTransitionNames {
  ACC = 'accelerate',
  DEC = 'declerate',
  BR = 'break',
  RELEASE = 'release'
}

export const GAS_TAKEOVER_VELOCITY = 30;

const acc1: Transition = {
  from: FSMStates.EV,
  to: [FSMStates.EV, FSMStates.GAS],
  name: FSMTransitionNames.ACC,
  decider: ((vel: number) => vel > GAS_TAKEOVER_VELOCITY ? FSMStates.GAS : FSMStates.EV)
};
const acc2: Transition = {
  from: FSMStates.GAS,
  to: FSMStates.GAS,
  name: FSMTransitionNames.ACC,
};
const acc3: Transition = {
  from: FSMStates.CHARGING,
  to: FSMStates.EV,
  name: FSMTransitionNames.ACC,
};
const dec1: Transition = {
  from: FSMStates.GAS,
  to: [FSMStates.EV, FSMStates.GAS],
  name: FSMTransitionNames.DEC,
  decider: ((vel: number) => vel > GAS_TAKEOVER_VELOCITY ? FSMStates.GAS : FSMStates.EV)
}
const dec2: Transition = {
  from: FSMStates.EV,
  to: [FSMStates.EV, FSMStates.CHARGING],
  name: FSMTransitionNames.DEC,
  decider: ((vel: number) => vel > 0 ? FSMStates.CHARGING : FSMStates.EV)
}
const charge: Transition = {
  from: '*',
  to: FSMStates.CHARGING,
  name: FSMTransitionNames.BR
};
const release: Transition = {
  from: '*',
  to: FSMStates.EV,
  name: FSMTransitionNames.RELEASE
}

var fsm = new FiniteCanMachine(FSMStates.CHARGING, [acc1, acc2, acc3, dec1, dec2, charge, release]);
(<any>window).fsm = fsm;

export enum EngineMode {
  GAS,
  EV,
  CHARGING
}

export interface EngineActionTypes extends Action {
  type: VelocityActions;
  engineMode: EngineMode;
}

function executeEnumBasedDispatch(dispatch: Dispatch<ReducerMap>, currentStateName: string): void {
  switch (currentStateName) {
    case FSMStates.CHARGING: {
      dispatch(changeEngine(EngineMode.CHARGING));
      break;
    }
    case FSMStates.EV: {
      dispatch(changeEngine(EngineMode.EV));
      break;
    }
    case FSMStates.GAS: {
      dispatch(changeEngine(EngineMode.GAS));
      break;
    }
  }
}

export function emitAcceleration(throttle: number): (dispatch: Dispatch<ReducerMap>) => void {
  return (dispatch: Dispatch<ReducerMap>) => {
    fsm.go(FSMTransitionNames.ACC, throttle);
    const current: string = fsm.current;
    executeEnumBasedDispatch(dispatch, current);
  }
}

export function emitDeceleration(throttle: number): (dispatch: Dispatch<ReducerMap>) => void {
  return (dispatch: Dispatch<ReducerMap>) => {
    fsm.go(FSMTransitionNames.DEC, throttle);
    const current: string = fsm.current;
    executeEnumBasedDispatch(dispatch, current);
  }
}

export function emitBreak(): (dispatch: Dispatch<ReducerMap>) => void {
  return (dispatch: Dispatch<ReducerMap>) => {
    fsm.go(FSMTransitionNames.BR);
    const current: string = fsm.current;
    executeEnumBasedDispatch(dispatch, current);
  }
}

export function emitRelease(): (dispatch: Dispatch<ReducerMap>) => void {
  return (dispatch: Dispatch<ReducerMap>) => {
    fsm.go(FSMTransitionNames.RELEASE);
    const current: string = fsm.current;
    executeEnumBasedDispatch(dispatch, current);
  }
}