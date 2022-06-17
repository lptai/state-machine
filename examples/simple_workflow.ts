import { StateMachine } from '../src/state_machine';
import { StateTransition } from '../src/state_transition';

enum TriggerAction {
  Approve = 'approve',
  Reject = 'reject',
}

enum Status {
  Pending = 'Pending',
  Ready = 'Ready',
  Deleted = 'Deleted',
}

export const simpleWorkFlow = new StateMachine<Status, TriggerAction>()
  .configure(Status.Pending)
  .transitions(
    StateTransition.with<Status, TriggerAction>(Status.Pending)
      .when(TriggerAction.Approve)
      .nextState(Status.Ready)
      .when(TriggerAction.Reject)
      .nextState(Status.Deleted),
  )
  .subscribeOn(Status.Deleted)
  .then((oldState, action, newState) =>
    console.log(
      `Hey I've just been ${newState} by action: ${action}. My previous state: ${oldState}`,
    ),
  )
  .subscribeOn(Status.Deleted)
  .then(() => console.log('Just another subscriber of Rejected'))
  .subscribeOn(Status.Deleted)
  .then(() => console.log('this is approved subscriber'));

simpleWorkFlow.next(TriggerAction.Reject);
console.log(simpleWorkFlow.state);
simpleWorkFlow.next(TriggerAction.Approve);
console.log(simpleWorkFlow.state);
