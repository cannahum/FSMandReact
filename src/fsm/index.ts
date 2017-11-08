enum TransitionState {
  SUCCESS,
  PENDING,
  CANCELLED,
  NOCHANGE
}

export enum TransitionErrors {
  INVALID_TRANSITION = 'invalid_transition',
  INVALID_TRANSITION_NAME = 'invalid_transition_name',
  INVALID_CALLBACK = 'invalid_callback'
}

export type DeciderFunction = (...args: any[]) => string;

export interface Transition {
  name: string;
  from: string | string[] | null | undefined;
  to: string | string[] | null | undefined;
  decider?: DeciderFunction
}

type EventCallback = (...args: any[]) => void;
export interface EventCallbacks {
  [index: string]: EventCallback;
}
export interface RegisteredEvents {
  beforeTransition?: EventCallback;
  afterTransition?: EventCallback;
}

export interface StateNode {
  name: string;
  decider?: DeciderFunction;
  transitions: {
    [index: string]: StateNode | StateNode[];
  }
}

const WILD_CARD = '*';

class FiniteCanMachine {
  private stateNames: Set<string>;
  private transitionNames: Set<string>;
  private currentStateNode: StateNode;
  private stateNodesByName: Map<string, StateNode>;
  private normalizedEvents: Map<string, EventCallback>;

  get directedGraph(): StateNode {
    if (process.env.NODE_ENV === 'test') {
      return this.currentStateNode;
    }
    throw Error('Only in TEST environment');
  }

  get nodeByName() {
    if (process.env.NODE_ENV === 'test') {
      return this.stateNodesByName;
    }
    throw Error('Only in TEST environment');
  }

  get transitions() {
    if (process.env.NODE_ENV === 'test') {
      return this.transitionNames;
    }
    throw Error('Only in TEST environment');
  }

  get current() {
    return this.currentStateNode.name;
  }

  /**
   * This constructor will build the entire directed graph.
   * 1. Lay out all potential state names and transition names.
   * 2. Iterate over the transition names and find the 'from's and the 'to's and the 'decider's.
   * @param init 
   * @param transitions 
   * @param registeredEvents 
   */
  constructor(init: string, transitions: Transition[], registeredEvents?: EventCallbacks) {
    this.stateNodesByName = new Map();
    this.stateNames = new Set();
    this.transitionNames = new Set();
    this.normalizedEvents = new Map();

    let wildCardTransition: Transition | null = null;
    let wildCardFromTransitions: Transition[] = [];

    if (registeredEvents && Object.keys(registeredEvents).length > 0) {
      // Re-organize the registered events to be lower-cased - kind of a normalization.
      for (let key of Object.keys(registeredEvents)) {
        const newKey = key.toLowerCase();
        if (typeof registeredEvents[key] !== 'function') {
          throw Error(TransitionErrors.INVALID_CALLBACK);
        }
        this.normalizedEvents.set(newKey, registeredEvents[key]);
      }
    }
    for (const transition of transitions) {
      let { name, from, to, decider } = transition;
      if (name === WILD_CARD) {
        wildCardTransition = transition;
        continue;
      }
      if (!name && name !== '') {
        throw Error(TransitionErrors.INVALID_TRANSITION_NAME + ', ' + name);
      }
      if (from === WILD_CARD || !from || from === null) {
        from = WILD_CARD;
        wildCardFromTransitions.push(transition);
        continue;
      }
      if (typeof from === 'string') {
        from = [from];
      }

      if (!to || to === null) {
        throw Error(TransitionErrors.INVALID_TRANSITION_NAME + ', ' + to);
      }
      if (typeof to === 'string') {
        to = [to];
      }

      for (let fromName of from) {
        let fromStateNode: StateNode = this.getStateOrCreate(fromName, decider);
        for (let toName of to) {
          let toStateNode: StateNode = this.getStateOrCreate(toName);
          const existingTransition: StateNode | StateNode[] | undefined = fromStateNode.transitions[name];
          if (!existingTransition) {
            fromStateNode.transitions[name] = toStateNode;
          } else if (Array.isArray(existingTransition)) {
            existingTransition.push(toStateNode);
          } else {
            fromStateNode.transitions[name] = [existingTransition, toStateNode];
          }
        }
        if (init === fromName && !this.currentStateNode) {
          this.currentStateNode = fromStateNode;
        }
      }
      this.transitionNames.add(name);
    }
    for (let transition of wildCardFromTransitions) {
      this.registerWildCardTransition(transition, 'from');
    }
    if (wildCardTransition !== null) {
      this.registerWildCardTransition(wildCardTransition, 'transitionName');
    }
  }

  public go(transitionName: string, ...args: any[]): void {
    // console.log('[go]', transitionName);
    if (!this.transitionNames.has(transitionName)) {
      // console.log('[go] doesn\'t exist in the transition names');
      if (transitionName === '') {
        return this.go(WILD_CARD);
      }
      throw Error(TransitionErrors.INVALID_TRANSITION);
    }
    // console.log('[go] continue\n', this.currentStateNode.transitions);
    if (!this.currentStateNode.transitions[transitionName]) {
      throw Error(TransitionErrors.INVALID_TRANSITION);
    }
    let nextState: StateNode | undefined;
    const potentials: StateNode | StateNode[] = this.currentStateNode.transitions[transitionName];
    if (Array.isArray(potentials)) {
      if (this.currentStateNode.decider) {
        const nextStateName: string = this.currentStateNode.decider.apply(this, args);
        nextState = this.stateNodesByName.get(nextStateName);
      } else {
        nextState = potentials[0];
      }
    } else {
      nextState = potentials;
    }
    if (!nextState) {
      throw Error(TransitionErrors.INVALID_TRANSITION);
    }
    const beforeName = `before${transitionName.toLowerCase()}`;
    if (this.normalizedEvents.has(beforeName)) {
      const cb = this.normalizedEvents.get(beforeName);
      if (cb) {
        cb();
      }
    }
    this.currentStateNode = nextState;
    const afterName = `on${transitionName.toLowerCase()}`;
    if (this.normalizedEvents.has(afterName)) {
      const cb = this.normalizedEvents.get(afterName);
      if (cb) {
        cb();
      }
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
      } : {});
      this.stateNodesByName.set(name, state);
    }
    return state;
  }

  private registerWildCardTransition(t: Transition, type: 'from' | 'transitionName'): void {
    const { name, from, to, decider } = t;
    this.transitionNames.add(name);
    if (typeof to !== 'string') {
      throw Error(TransitionErrors.INVALID_TRANSITION_NAME + ': Wild Card Transitions can take only one TO parameter');
    }
    const toState: StateNode = this.getStateOrCreate(to, decider);
    for (let [nodeName, node] of this.stateNodesByName) {
      node.transitions[name] = toState;
    }
  }

}

export default FiniteCanMachine;