import { StateTrigger } from './interface';

export class StateTransition<T, R> {
  private _state: T;
  private _next: StateTrigger<T, R>[] = [];

  private constructor(state: T) {
    this._state = state;
  }

  static with<T, R>(state: T): StateTransition<T, R> {
    return new this(state);
  }

  get state() {
    return this._state;
  }

  next(trigger: R): T {
    return this._next.find((n) => n.on === trigger)?.nextState || this._state;
  }

  when(trigger: R) {
    return {
      nextState: (nextState: T) => {
        this._next.push({ on: trigger, nextState });
        return this;
      },
    };
  }
}
