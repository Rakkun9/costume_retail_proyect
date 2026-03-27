import { DomainEventPublisher } from './domain-event.publisher';
import { DomainEventObserver } from './domain-event.observer';

describe('DomainEventPublisher', () => {
  it('notifica a observadores suscritos', async () => {
    const baseObserverA = { update: jest.fn() } as any;
    const baseObserverB = { update: jest.fn() } as any;

    const publisher = new DomainEventPublisher(baseObserverA, baseObserverB);

    const extraObserver: DomainEventObserver = {
      update: jest.fn(),
    };

    publisher.subscribe(extraObserver);

    const event = {
      name: 'evento.prueba',
      occurredOn: new Date('2026-03-26T10:00:00.000Z'),
      payload: { ok: true },
    };

    await publisher.notify(event);

    expect(baseObserverA.update).toHaveBeenCalledWith(event);
    expect(baseObserverB.update).toHaveBeenCalledWith(event);
    expect(extraObserver.update).toHaveBeenCalledWith(event);
  });

  it('deja de notificar a un observador removido', async () => {
    const baseObserverA = { update: jest.fn() } as any;
    const baseObserverB = { update: jest.fn() } as any;

    const publisher = new DomainEventPublisher(baseObserverA, baseObserverB);

    const removable: DomainEventObserver = {
      update: jest.fn(),
    };

    publisher.subscribe(removable);
    publisher.unsubscribe(removable);

    await publisher.notify({
      name: 'evento.no-removable',
      occurredOn: new Date(),
      payload: {},
    });

    expect(removable.update).not.toHaveBeenCalled();
  });
});
