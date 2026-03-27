import { Injectable } from '@nestjs/common';
import { DomainEventObserver } from '../domain-event.observer';
import { DomainEvent } from '../domain-event.types';

@Injectable()
export class InMemoryEventsObserver implements DomainEventObserver {
  private readonly events: DomainEvent[] = [];

  update(event: DomainEvent): void {
    this.events.push(event);
  }

  findRecent(limit = 25): DomainEvent[] {
    return [...this.events].reverse().slice(0, limit);
  }
}
