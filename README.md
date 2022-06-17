# state-machine

When participate in a system that require multiple states, there are some confusion about the state and state transition. This repo is just a practice to achieve those with a very simple source code

## Define a simple workflow

```js
export const simpleWorkFlow = new StateMachine<Status, TriggerAction>()
  .configure(Status.Pending)
  .transitions(
    StateTransition.init<Status, TriggerAction>()
      .with(Status.Pending)
      .when(TriggerAction.Approve)
      .nextState(Status.Ready)
      .when(TriggerAction.Reject)
      .nextState(Status.Deleted)
  )
```

- Then subscribe on `state`

```js
  simpleWorkFlow
  .subscribeOn(Status.Deleted)
  .then((oldState: Status, action: TriggerAction, newState: Status) =>
    console.log(
      `Hey I've just been ${newState} by action: ${action}. My previous state: ${oldState}`
    )
  )
  .subscribeOn(Status.Deleted)
  .then(() => console.log('Just another subscriber of Rejected'))
  .subscribeOn(Status.Ready)
  .then(() => console.log('this is approved subscriber'));
```

- output

```js
simpleWorkFlow.next(TriggerAction.Reject);
// Hey I've just been Deleted by action: reject. My previous state: Pending
// Just another subscriber of Rejected

simpleWorkFlow.next(TriggerAction.Reject);
console.log(simpleWorkFlow.state); // Deleted
simpleWorkFlow.next(TriggerAction.Approve);
console.log(simpleWorkFlow.state); // Deleted
```

- If you want to add more transition

```js
simpleWorkFlow.transitions(
  StateTransition.init<Status, TriggerAction>()
    .with(Status.Deleted)
    .when(TriggerAction.Approve)
    .nextState(Status.Ready)
);

simpleWorkFlow.next(TriggerAction.Approve); // this is approved subscriber
console.log(simpleWorkFlow.state); // Ready
```
