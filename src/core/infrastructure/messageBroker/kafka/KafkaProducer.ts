import { Producer } from "kafkajs";
import { EventPublisher } from "@core/domain/entity/events/EventPublisher";
import kafka from "./config";

export class KafkaProducer implements EventPublisher {
  private producer: Producer;
  private connected = false;
  constructor() {
    this.producer = kafka.producer();
  }

  async connect() {
    if (!this.connected) {
      await this.producer.connect();
      this.connected = true;
    }
  }

  async publish(eventName: string, data: any): Promise<void> {
    await this.connect();

    try {
      console.log(`Publishing event ${eventName}`);
      await this.producer.send({
        topic: eventName,
        messages: [{ value: JSON.stringify(data) }],
      });
      console.log(`Event ${eventName} published`);
    } catch (error) {
      console.error(`Error publishing event ${eventName}: ${error}`);
      throw error;
    }
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}
