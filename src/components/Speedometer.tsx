import * as React from 'react';
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from 'redux';
import { accelerate, decelerate, changeEngine } from '../redux/actions/velocity_actions';
import { ReducerMap } from '../redux/reducers'
import { VelocityState } from '../redux/reducers/velocity_reducer'

interface SpeedometerProps extends VelocityState {
  accelerate: typeof accelerate;
  decelerate: typeof decelerate;
  changeEngine: typeof changeEngine;
}

class Speedometer extends React.Component<SpeedometerProps, {}> {
  componentDidMount() {
    setTimeout(() => {
      console.log('Do Something Here');
    }, 300)
  }

  render() {
    return (
      <div>
        Current Velocity {this.props.velocity}
      </div>
    )
  }
}

type StateProps = VelocityState;
const mapStateToProps = (state: ReducerMap): StateProps => {
  return state.velocityReducer;
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
