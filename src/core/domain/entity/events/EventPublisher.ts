export interface EventPublisher {
  publish(eventName: string, data: any): Promise<void>;
}
