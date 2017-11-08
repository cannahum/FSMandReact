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
      <div style={styles.container}>
        <h3>Current Pedal: {this.props.pedal}</h3>
        <h4>Throttle: {this.props.throttle}</h4>
        <button onClick={() => this.onClick(Pedals.GAS_PEDAL)}>
          Gas
        </button>
        <button onClick={() => this.onClick(Pedals.BREAK_PEDAL)}>
          Break
        </button>
        {
          this.props.pedal !== Pedals.RELEASE ?
            <button onClick={() => this.onClick(Pedals.RELEASE)}>
              RELEASE
          </button>
            : null
        }
      </div>
    )
  }

  onClick(pedal: Pedals) {
    switch (pedal) {
      case Pedals.GAS_PEDAL: {
        this.props.pressTheGas(100);
        break;
      }
      case Pedals.BREAK_PEDAL: {
        this.props.pressTheBreak(100);
        break;
      }
      case Pedals.RELEASE: {
        this.props.releasePedals();
        break;
      }
    }
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
    pressTheGas: bindActionCreators(pressTheGas, dispatch),
    pressTheBreak: bindActionCreators(pressTheBreak, dispatch),
    releasePedals: bindActionCreators(releasePedals, dispatch)
  }
}

const styles: any = {
  container: {
    width: '40%'
  }
}

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps)(Throttle);
