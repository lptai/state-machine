import { StateTrigger } from './interface';

export class StateTransition<T, R> {
  private _state: T;
  private _next: StateTrigger<T, R>[] = [];

  static init<T, R>(): StateTransition<T, R> {
    return new this();
  }

  with(state: T): StateTransition<T, R> {
    this._state = state;
    return this;
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
