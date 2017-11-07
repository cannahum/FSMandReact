enum TransitionState {
  SUCCESS,
  PENDING,
  CANCELLED,
  NOCHANGE
}

enum TransitionErrors {
  INVALID_TRANSITION = 'invalid_transition'
}

export type DeciderFunction = (...args: any[]) => void;

export interface Transition {
  name: string;
  from: string | string[] | null | undefined;
  to: string | string[] | null | undefined;
  decider?: DeciderFunction
}

export interface RegisteredEvents {
  [index: string]: (cb: (...args: any[]) => any) => void;
}

interface StateNode {
  name: string;
  exitEvents?: RegisteredEvents;
  transitions: {
    [index: string]: TransitionBlock<StateNode>;
  }
}

interface TransitionBlock<T> {
  decider?: DeciderFunction;
  to: T | T[];
}

class FiniteCanMachine {
  private stateNames: Set<string>;
  private transitionNames: Set<string>;
  private currentStateName: string;
  private currentStateNode: StateNode;
  private stateNodesByName: Map<string, StateNode>;

  /**
   * This constructor will build the entire directed graph.
   * 1. Lay out all potential state names and transition names.
   * 2. Iterate over the transition names and find the 'from's and the 'to's and the 'decider's.
   * @param init 
   * @param transitions 
   * @param registeredEvents 
   */
  constructor(init: string, transitions: Transition[], registeredEvents?: RegisteredEvents) {
    this.stateNodesByName = new Map();
    this.stateNames = new Set();
    this.transitionNames = new Set();
    this.currentStateName = init;

    for (const transition of transitions) {
      let { name, from, to, decider } = transition;
      if (!from || from === null) {
        from = '*';
      }
      if (typeof from === 'string') {
        from = [from];
      }

      if (!to || to === null) {
        to = '*';
      }
      if (typeof to === 'string') {
        to = [to];
      }

      for (let fromName of from) {
        let fromStateNode: StateNode = this.getStateOrCreate(fromName, decider);
        for (let toName of to) {
          let toStateNode: StateNode = this.getStateOrCreate(toName);
          fromStateNode.transitions[name] = {
            to: toStateNode,
            decider
          }
        }
        if (this.currentStateName === fromName && !this.currentStateNode) {
          this.currentStateNode = fromStateNode;
        }
      }
      this.transitionNames.add(name);
    }
  }

  private getStateOrCreate(name: string, decider?: DeciderFunction): StateNode {
    let state: StateNode | undefined = this.stateNodesByName.get(name);
    if (!state) {
      this.stateNames.add(name);
      state = Object.assign({
        name,
        transitions: {}
      }, decider ? {
        decider
      }: {});
      this.stateNodesByName.set(name, state);
    }
    return state;
  }

}

export default FiniteCanMachine;