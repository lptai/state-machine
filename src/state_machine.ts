import { StateTransition } from './state_transition';
import { IStateMachine, Subscriber } from './interface';

/**
 * Purpose: centralize state and state transition
 */
export class StateMachine<T, R> implements IStateMachine<T, R> {
  private currentState: T;
  private definition: StateTransition<T, R>[] = [];
  private subscribers: Subscriber<T, R>[] = [];

  get state(): T {
    return this.currentState;
  }

  configure(initialState: T) {
    this.currentState = initialState;
    return this;
  }

  transitions(...args) {
    this.definition = this.definition.concat(args);
    return this;
  }

  next(action: R): T {
    const oldState = this.currentState;

    const state = this.definition.find(
      (def) => def.state === this.currentState,
    );

    if (!state) {
      return this.currentState;
    }

    this.currentState = state.next(action);

    if (oldState !== this.currentState) {
      this.subscribers
        .filter((sub) => sub.state === this.currentState)
        .forEach((sub) => sub.fn(oldState, action, this.currentState));
    }

    return this.currentState;
  }

  subscribeOn(state: T) {
    return {
      then: (fn) => {
        this.subscribers.push({ state, fn });
        return this;
      },
    };
  }
}
