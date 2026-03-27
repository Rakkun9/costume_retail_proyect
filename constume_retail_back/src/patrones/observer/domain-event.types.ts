export interface DomainEvent<TPayload = unknown> {
  name: string;
  occurredOn: Date;
  payload: TPayload;
}
