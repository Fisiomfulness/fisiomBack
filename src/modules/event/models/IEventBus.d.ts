import { DomainEvent } from './DomainEvent';

export interface IEventBus {
  publish(event: DomainEvent): void;
  subscribe(name: string, handler: (data: DomainEvent) => void): void;
  unsubscribe(name: string, handler: (data: DomainEvent) => void): void;
}
