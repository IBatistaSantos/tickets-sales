import { EventPublisher } from "./EventPublisher";

export class BaseEvent {
  constructor(private publisher: EventPublisher) {}

  async emit(eventName: string, data: any): Promise<void> {
    await this.publisher.publish(eventName, data);
  }
}
