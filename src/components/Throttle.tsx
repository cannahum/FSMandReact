import * as React from 'react';
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from 'redux';
import { Pedals, PedalActionTypes, pressTheBreak, pressTheGas, releasePedals } from '../redux/actions/pedal_actions';
import { ReducerMap } from '../redux/reducers'
import { PedalState } from '../redux/reducers/pedal_reducer'

interface ThrottleProps {
  throttle: number;
  pedal: Pedals;
  pressTheGas: typeof pressTheGas;
  pressTheBreak: typeof pressTheBreak;
  releasePedals: typeof releasePedals;
}

class Throttle extends React.Component<ThrottleProps, {}> {
  render() {
    return (
      <div>
        <h3>Current Pedal: { this.props.pedal }</h3>
        <h4>Throttle: { this.props.throttle }</h4>
      </div>
    )
  }
}

type StateProps = Pick<PedalState, 'throttle' | 'pedal'>
const mapStateToProps = (state: ReducerMap): StateProps => {
  return {
    throttle: state.pedalReducer.throttle,
    pedal: state.pedalReducer.pedal
  }
}

interface DispatchProps {
  pressTheGas: typeof pressTheGas;
  pressTheBreak: typeof pressTheBreak;
  releasePedals: typeof releasePedals;
}
const mapDispatchToProps = (dispatch: Dispatch<ReducerMap>): DispatchProps => {
  return {
    pressTheGas,
    pressTheBreak,
    releasePedals
  }
}

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps)(Throttle)
