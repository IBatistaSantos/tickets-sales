import { EventPublisher } from "@core/domain/entity/events/EventPublisher";



export class MockEventPublisher implements EventPublisher {
  async publish(eventName: string, data: any): Promise<void> {
    console.log(`Event ${eventName} published with data: ${data}`);
  }
}