import * as mocha from 'mocha';
import { expect } from 'chai';
import FiniteCanMachine, { Transition, StateNode, DeciderFunction, TransitionErrors, RegisteredEvents } from './index';

describe('FSM Initialization', () => {
  it('throws an error if a transition name is undefined', () => {
    const t1: any = {
      from: 'state1',
      to: 'state2',
      name: undefined
    };
    try {
      const fsm = new FiniteCanMachine('state1', [t1]);
      throw Error('should not have happened');
    } catch (e) {
      expect(e.message).to.equal(TransitionErrors.INVALID_TRANSITION_NAME + ', undefined');
    }
  });

  it('correctly register simple nodes', () => {
    const t1: Transition = {
      from: 'state1',
      to: 'state2',
      name: 'transition1'
    };
    const t2: Transition = {
      from: 'state2',
      to: 'state1',
      name: 'transition2'
    };
    const fsm = new FiniteCanMachine('state1', [t1, t2]);
    const currentNode: StateNode = fsm.directedGraph;
    expect(currentNode).to.be.an('object');
    expect(currentNode.name).to.equal('state1');
    expect(currentNode.transitions).to.haveOwnProperty('transition1');

    const nextNode: StateNode | StateNode[] = currentNode.transitions['transition1'];
    expect(nextNode).not.to.be.undefined;
    expect(nextNode).not.to.be.an('array');
    if (!Array.isArray(nextNode)) {
      expect(nextNode.name).to.equal('state2');
      expect(nextNode.transitions).to.haveOwnProperty('transition2');
    } else {
      throw Error();
    }
  });

  it('correctly registers array nodes', () => {
    const t1: Transition = {
      from: 'state1',
      to: ['state2', 'state3'],
      name: 'transition1',
      decider: (a => a ? 'state2' : 'state3')
    };
    const t2: Transition = {
      from: 'state2',
      to: 'state1',
      name: 'transition2'
    };
    const t3: Transition = {
      from: 'state3',
      to: 'state2',
      name: 'transition3'
    };

    const fsm = new FiniteCanMachine('state1', [t1, t2, t3]);
    const currentNode: StateNode = fsm.directedGraph;
    expect(currentNode.transitions).to.haveOwnProperty('transition1');
    const nextNode: StateNode | StateNode[] = currentNode.transitions['transition1'];
    expect(nextNode).to.be.an('array');
  });

  it('correctly registers wildcards', () => {
    const t1: Transition = {
      from: 'state1',
      to: 'state2',
      name: 'transition1'
    };
    const t2: Transition = {
      from: 'state2',
      to: 'state3',
      name: 'transition2'
    };
    const t3: Transition = {
      from: '*',
      to: 'state1',
      name: '*'
    };

    const fsm = new FiniteCanMachine('state1', [t1, t2, t3]);
    const nodesByName: Map<string, StateNode> = fsm.nodeByName;
    for (let [name, node] of nodesByName) {
      expect(node.transitions).to.haveOwnProperty('*');
      const potential: StateNode | StateNode[] = node.transitions['*'];
      expect(potential).to.not.be.undefined;
      expect(potential).to.not.be.an('array');
      if (!Array.isArray(potential)) {
        expect(potential.name).to.equal('state1');
      }
    }
    expect(fsm.transitions.has('*')).to.be.true;
  });
});

describe('FSM Transitions', () => {
  it('correctly transition between simple nodes', () => {
    const t1: Transition = {
      from: 'state1',
      to: 'state2',
      name: 'transition1'
    };
    const t2: Transition = {
      from: 'state2',
      to: 'state1',
      name: 'transition2'
    };
    const fsm = new FiniteCanMachine('state1', [t1, t2]);
    const currentNode: StateNode = fsm.directedGraph;
    expect(currentNode.name).to.equal('state1');

    fsm.go('transition1');
    const newNode: StateNode = fsm.directedGraph;
    expect(newNode.name).to.equal('state2');
  });

  it('throws an Error when there is an invalid transition', () => {
    const t1: Transition = {
      from: 'state1',
      to: 'state2',
      name: 'transition1'
    };
    const t2: Transition = {
      from: 'state2',
      to: 'state1',
      name: 'transition2'
    };
    const fsm = new FiniteCanMachine('state1', [t1, t2]);
    expect(fsm.current).to.equal('state1');
    try {
      fsm.go('transition2');
      throw Error('This should not have happened!');
    } catch (e) {
      expect(e.message).to.equal(TransitionErrors.INVALID_TRANSITION);
    }
  });

  it('correctly transition with array of states and decider functions', () => {
    const t1: Transition = {
      from: 'state1',
      to: ['state2', 'state3'],
      name: 'transition1',
      decider: (a: boolean) => (a ? 'state2' : 'state3')
    };
    const t2: Transition = {
      from: 'state2',
      to: 'state1',
      name: 'transition2'
    };

    const fsm = new FiniteCanMachine('state1', [t1, t2]);
    expect(fsm.current).to.equal('state1');
    fsm.go('transition1', true);
    expect(fsm.current).to.equal('state2');
    fsm.go('transition2');
    expect(fsm.current).to.equal('state1');
    fsm.go('transition1', false);
    expect(fsm.current).to.equal('state3');
  });

  it('correctly transitions with wildcards', () => {
    const t1: Transition = {
      from: 'state1',
      to: 'state2',
      name: 'transition1'
    };
    const t2: Transition = {
      from: 'state2',
      to: 'state3',
      name: 'transition2'
    };
    const t3: Transition = {
      from: '*',
      to: 'state1',
      name: '*'
    };

    const fsm = new FiniteCanMachine('state1', [t1, t2, t3]);
    expect(fsm.current).to.equal('state1');
    fsm.go('transition1', true);
    expect(fsm.current).to.equal('state2');
    fsm.go('transition2');
    expect(fsm.current).to.equal('state3');
    fsm.go('*', false);
    expect(fsm.current).to.equal('state1');
  });
});

describe('FSM Events', () => {
  it('registers events correctly', () => {
    const t1: Transition = {
      from: 'state1',
      to: 'state2',
      name: 'transition1'
    };
    const t2: Transition = {
      from: 'state2',
      to: 'state1',
      name: 'transition2'
    };

    let beforeEventFired = false;
    let onEventFired = false;
    const events = {
      beforeTransition2: () => { beforeEventFired = true },
      onTransition2: () => { onEventFired = true }
    }
    const fsm = new FiniteCanMachine('state1', [t1, t2], events);
    fsm.go('transition1');
    expect(fsm.current).to.equal('state2');
    setTimeout(() => {
      expect(beforeEventFired).to.be.true;
      expect(onEventFired).to.be.true;
    }, 1000);
  });
});