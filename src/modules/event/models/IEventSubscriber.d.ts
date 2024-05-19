import { DomainEvent, DomainEventStatic } from './DomainEvent';

export interface IEventSubscriber {
  subscribedTo: DomainEventStatic;
  on(event: DomainEvent): void;
}
