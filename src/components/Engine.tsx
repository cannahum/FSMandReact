import * as React from 'react';
import { EngineMode, FSMStates } from '../redux/actions/engine_actions'
import Paper from 'material-ui/Paper';

interface EngineProps {
  engineMode: EngineMode
}

interface Preset {
  color: string;
  driving: string;
  engine: string;
}

class Engine extends React.Component<EngineProps, {}> {
  render() {
    const mode = this.props.engineMode;
    let whichEngine = 'GAS';
    let drivingMode = 'DRIVING';
    switch (mode) {
      case EngineMode.CHARGING: {
        drivingMode = 'CHARGING';
        whichEngine = 'EV';
        break;
      }
      case EngineMode.EV: {
        drivingMode = 'DRIVING';
        whichEngine = 'EV';
        break;
      }
      case EngineMode.GAS: {
        drivingMode = 'DRIVING';
        whichEngine = 'GAS';
        break;
      }
    }

    const presets: Preset[] = [
      {
        driving: 'CHARGING',
        engine: 'EV',
        color: 'blue'
      },
      {
        driving: 'DRIVING',
        engine: 'EV',
        color: 'green'
      },
      {
        driving: 'DRIVING',
        engine: 'GAS',
        color: 'red'
      }
    ];
    return (
      <div style={styles.container}>
        {presets.map((preset: Preset, index: number) => (this.getPaper(preset, drivingMode, whichEngine, index)))}
      </div>
    )
  }

  private getEngineName(mode: EngineMode): string {
    switch (mode) {
      case (EngineMode.CHARGING): {
        return FSMStates.CHARGING.toUpperCase();
      }
      case (EngineMode.EV): {
        return FSMStates.EV.toUpperCase();
      }
      default: {
        return FSMStates.GAS.toUpperCase();
      }
    }
  }

  getPaper(preset: Preset, currentDriving: string, currentEngine: string, key: number): JSX.Element {
    const style = {
      height: 100,
      minWidth: 250,
      margin: 3,
      textAlign: 'center',
      display: 'inline-block',
    };

    const { driving, engine, color} = preset;
    let z = 0;
    if (driving === currentDriving && engine === currentEngine) {
      Object.assign(style, {
        backgroundColor: color
      });
      z = 5;
    } else {
      Object.assign(style, {
        backgroundColor: 'lightgray',
        color: 'gray'
      });
    }
    return (
      <Paper
        style={style}
        key={key}
        zDepth={z}>
        <h1>{`${engine}: ${driving}`}</h1>
      </Paper>
    )
  }
}

const styles: any = {
  marginLeft: '10px',
  container: {
    display: 'block',
    textAlign: 'center'
  }
}

export default Engine;