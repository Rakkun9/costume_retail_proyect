import { Global, Module } from '@nestjs/common';
import { DomainEventPublisher } from './domain-event.publisher';
import { ConsoleLogObserver } from './observers/console-log.observer';
import { InMemoryEventsObserver } from './observers/in-memory-events.observer';

@Global()
@Module({
  providers: [DomainEventPublisher, ConsoleLogObserver, InMemoryEventsObserver],
  exports: [DomainEventPublisher, InMemoryEventsObserver],
})
export class ObserverModule {}
