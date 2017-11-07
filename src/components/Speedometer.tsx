import * as React from 'react';
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from 'redux';
import { accelerate, decelerate, changeEngine } from '../redux/actions/velocity_actions';
import { ReducerMap } from '../redux/reducers'
import { VelocityState } from '../redux/reducers/velocity_reducer'
import { Pedals } from '../redux/actions/pedal_actions'

interface SpeedometerProps extends VelocityState {
  accelerate: typeof accelerate;
  decelerate: typeof decelerate;
  changeEngine: typeof changeEngine;
  throttle: number;
  pedal: Pedals
}

class Speedometer extends React.Component<SpeedometerProps, {}> {

  render() {
    this.changeVelocity();
    return (
      <div>
        Current Velocity {this.props.velocity}
      </div>
    )
  }

  private changeVelocity() {
    const differential: number = this.props.throttle - this.props.velocity;
    // FSM???
    
  }
}

interface StateProps extends VelocityState {
  throttle: number;
  pedal: Pedals
}
const mapStateToProps = (state: ReducerMap): StateProps => {
  return Object.assign(state.velocityReducer, {
    throttle: state.pedalReducer.throttle,
    pedal: state.pedalReducer.pedal
  });
}

interface DispatchProps {
  accelerate: typeof accelerate;
  decelerate: typeof decelerate;
  changeEngine: typeof changeEngine;
}

const mapDispatchToProps = (dispatch: Dispatch<ReducerMap>): DispatchProps => {
  return {
    accelerate: bindActionCreators(accelerate, dispatch),
    decelerate: bindActionCreators(decelerate, dispatch),
    changeEngine: bindActionCreators(changeEngine, dispatch)
  }
}

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps)(Speedometer);
