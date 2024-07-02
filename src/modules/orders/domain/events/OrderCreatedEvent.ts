import { BaseEvent } from "../../../../core/domain/entity/events/BaseEvent";
import { EventPublisher } from "../../../../core/domain/entity/events/EventPublisher";

export class OrderCreatedEvent extends BaseEvent {
  constructor(publisher: EventPublisher, private data: any) {
    super(publisher);
  }

  async emit(): Promise<void> {
    await super.emit("order.created", this.data);
  }
}
