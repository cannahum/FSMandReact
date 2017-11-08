import * as React from 'react';
import { EngineMode, FSMStates } from '../redux/actions/engine_actions'

interface EngineProps {
  engineMode: EngineMode
}

class Engine extends React.Component<EngineProps, {}> {
  render() {
    return(
      <h2>{this.getEngineName(this.props.engineMode)}</h2>
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
}

export default Engine;