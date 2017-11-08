import * as React from 'react';
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from 'redux';
import { Pedals, PedalActionTypes, pressTheBreak, pressTheGas, releasePedals } from '../redux/actions/pedal_actions';
import { ReducerMap } from '../redux/reducers'
import { PedalState } from '../redux/reducers/pedal_reducer'
import Paper from 'material-ui/Paper';

interface ThrottleProps {
  throttle: number;
  pedal: Pedals;
  pressTheGas: typeof pressTheGas;
  pressTheBreak: typeof pressTheBreak;
  releasePedals: typeof releasePedals;
}

interface PedalOption {
  pedal: Pedals;
  label: string;
  color: string;
}

class Throttle extends React.Component<ThrottleProps, {}> {
  render() {
    const options: PedalOption[] = [
      {
        pedal: Pedals.GAS_PEDAL,
        label: 'GAS',
        color: 'green'
      },
      {
        pedal: Pedals.BREAK_PEDAL,
        label: 'BREAK',
        color: 'red',
      },
      {
        pedal: Pedals.RELEASE,
        label: 'RELEASE',
        color: 'blue'
      }
    ];
    this.makePedal = this.makePedal.bind(this);
    return (
      <div style={styles.container}>
        {/* <button onClick={() => this.onClick(Pedals.GAS_PEDAL)}>
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
        } */}
        {
          options.filter(({ pedal }) => (this.props.pedal !== Pedals.RELEASE || pedal !== Pedals.RELEASE)).map((op: PedalOption) => (this.makePedal(op)))
        }
      </div>
    )
  }

  makePedal(op: PedalOption): JSX.Element {
    const style = {
      height: 100,
      width: 70,
      margin: 3,
      textAlign: 'center',
      display: 'inline-block',
    };

    const pedalContainer = {
      width: 80,
      textAlign: 'center'
    }

    let { pedal, label, color } = op;
    let z = 0;
    if (pedal !== this.props.pedal) {
      Object.assign(style, {
        backgroundColor: color
      });
      z = 5;
    } else {
      label += `\nCurrent`
      Object.assign(style, {
        backgroundColor: 'lightgray',
        color: 'gray'
      });
    }
    return (
      <div style={pedalContainer}>
        <Paper
          style={style}
          key={pedal}
          onClick={(e: React.MouseEvent<any>) => { e.preventDefault(); this.onClick(pedal)}}
          zDepth={z}>
        </Paper>
        <p>{label}</p>
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
    minWidth: 360,
    display: 'flex',
    flexDirection: 'row'
  }
}

export default connect<StateProps, DispatchProps, {}>(mapStateToProps, mapDispatchToProps)(Throttle);
