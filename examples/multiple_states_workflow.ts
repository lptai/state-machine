import { StateMachine } from '../src/state_machine';
import { StateTransition } from '../src/state_transition';

enum Trigger {
  Approve = 'approve',
  Reject = 'reject',
}

enum TwoStepApprovalStatus {
  Pending = 'pending',
  PendingApproval = 'pending_approval',
  Approved = 'approved',
  Rejected = 'rejected',
}

export const twoStepApprovalFlow = new StateMachine<
  TwoStepApprovalStatus,
  Trigger
>()
  .configure(TwoStepApprovalStatus.Pending)
  .transitions(
    StateTransition.init<TwoStepApprovalStatus, Trigger>()
      .with(TwoStepApprovalStatus.Pending)
      .when(Trigger.Approve)
      .nextState(TwoStepApprovalStatus.PendingApproval)
      .when(Trigger.Reject)
      .nextState(TwoStepApprovalStatus.Rejected),
  )
  .transitions(
    StateTransition.init<TwoStepApprovalStatus, Trigger>()
      .with(TwoStepApprovalStatus.Pending)
      .when(Trigger.Approve)
      .nextState(TwoStepApprovalStatus.Approved)
      .when(Trigger.Reject)
      .nextState(TwoStepApprovalStatus.Rejected),
  );
