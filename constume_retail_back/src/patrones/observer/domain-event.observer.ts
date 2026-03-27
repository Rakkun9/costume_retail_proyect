import { DomainEvent } from './domain-event.types';

export interface DomainEventObserver {
  update(event: DomainEvent): Promise<void> | void;
}
