import { DomainEvent } from './DomainEvent';
import { IEventSubscriber } from './IEventSubscriber';

export interface IEventBus {
  publish(event: DomainEvent): void;
  subscribe(subscriber: IEventSubscriber): void;
  unsubscribe(subscriber: IEventSubscriber): void;
}
