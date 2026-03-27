import { Injectable, Logger } from '@nestjs/common';
import { DomainEventObserver } from '../domain-event.observer';
import { DomainEvent } from '../domain-event.types';

@Injectable()
export class ConsoleLogObserver implements DomainEventObserver {
  private readonly logger = new Logger(ConsoleLogObserver.name);

  update(event: DomainEvent): void {
    this.logger.log(`${event.name} - ${JSON.stringify(event.payload)}`);
  }
}
