import { Injectable } from '@nestjs/common';
import { DomainEventObserver } from './domain-event.observer';
import { DomainEvent } from './domain-event.types';
import { ConsoleLogObserver } from './observers/console-log.observer';
import { InMemoryEventsObserver } from './observers/in-memory-events.observer';

@Injectable()
export class DomainEventPublisher {
  private readonly observers: DomainEventObserver[] = [];

  constructor(
    consoleLogObserver: ConsoleLogObserver,
    inMemoryEventsObserver: InMemoryEventsObserver,
  ) {
    this.subscribe(consoleLogObserver);
    this.subscribe(inMemoryEventsObserver);
  }

  subscribe(observer: DomainEventObserver): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: DomainEventObserver): void {
    const index = this.observers.indexOf(observer);
    if (index >= 0) {
      this.observers.splice(index, 1);
    }
  }

  async notify(event: DomainEvent): Promise<void> {
    for (const observer of this.observers) {
      await observer.update(event);
    }
  }
}
