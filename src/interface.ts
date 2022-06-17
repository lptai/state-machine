import { StateTransition } from './state_transition';

export interface IStateMachine<T, R> {
  configure(initialState: T, definitions: StateTransition<T, R>[]);
  next(action: R): T;
}

export interface StateTrigger<T, R> {
  on: R;
  nextState: T;
}

export interface Subscriber<T, R> {
  fn: Function;
  state: T;
}
