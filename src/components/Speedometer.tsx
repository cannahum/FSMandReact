import * as React from 'react';
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from 'redux';
import { accelerate, decelerate, changeEngine } from '../redux/actions/velocity_actions';
import { emitAcceleration, emitDeceleration, GAS_TAKEOVER_VELOCITY } from '../redux/actions/engine_actions';
import { ReducerMap } from '../redux/reducers'
import { VelocityState } from '../redux/reducers/velocity_reducer'
import { Pedals } from '../redux/actions/pedal_actions'
import Engine from './Engine';
const ReactSpeedometer = require('react-d3-speedometer').default;

interface SpeedometerProps extends VelocityState {
  accelerate: typeof accelerate;
  decelerate: typeof decelerate;
  changeEngine: typeof changeEngine;
  emitAcceleration: typeof emitAcceleration;
  emitDeceleration: typeof emitDeceleration;
  throttle: number;
  pedal: Pedals
}

class Speedometer extends React.Component<SpeedometerProps, {}> {

  componentWillReceiveProps(nextProps: SpeedometerProps) {
    if (this.props.velocity <= GAS_TAKEOVER_VELOCITY && nextProps.velocity > GAS_TAKEOVER_VELOCITY) {
      this.props.emitAcceleration(nextProps.velocity);
    }
    if (this.props.velocity > GAS_TAKEOVER_VELOCITY && nextProps.velocity <= GAS_TAKEOVER_VELOCITY) {
      this.props.emitDeceleration(nextProps.velocity);
    }
  }

  componentDidUpdate() {
    this.changeVelocity();
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.speedometer}>
          <ReactSpeedometer
            value={this.props.velocity}
            minValue={0}
            maxValue={100}
            width={400}
            height={400}
          />
        </div>
        <Engine engineMode={this.props.engineMode} />
      </div>
    )
  }

  private changeVelocity() {
    if (this.props.pedal !== Pedals.BREAK_PEDAL) {
      const differential: number = this.props.throttle - this.props.velocity;
      // FSM???
      if (differential > 0) {
        this.props.accelerate();
      } else if (differential < 0) {
        this.props.decelerate();
      }
    } else {
      this.props.decelerate(true);
    }
  }
}

interface StateProps extends VelocityState {
  throttle: number;
  pedal: Pedals
}
const mapStateToProps = (state: ReducerMap): StateProps => {
  return {
    velocity: state.velocityReducer.velocity,
    enginePowerFactor: state.velocityReducer.enginePowerFactor,
    throttle: state.pedalReducer.throttle,
    pedal: state.pedalReducer.pedal,
    engineMode: state.velocityReducer.engineMode
  };
}

interface DispatchProps {
  accelerate: typeof accelerate;
  decelerate: typeof decelerate;
  changeEngine: typeof changeEngine;
  emitAcceleration: typeof emitAcceleration;
  emitDeceleration: typeof emitDeceleration;
}

const mapDispatchToProps = (dispatch: Dispatch<ReducerMap>): DispatchProps => {
  return {
    accelerate: bindActionCreators(accelerate, dispatch),
    decelerate: bindActionCreators(decelerate, dispatch),
    changeEngine: bindActionCreators(changeEngine, dispatch),
    emitAcceleration: bindActionCreators(emitAcceleration, dispatch),
    emitDeceleration: bindActionCreators(emitDeceleration, dispatch),
  }
}

const styles: any = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    minWidth: 700,
    maxWidth: 900,
    maxHeight: 450
  },
  speedometer: {
    minWidth: 450,
  }
}

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps)(Speedometer);
