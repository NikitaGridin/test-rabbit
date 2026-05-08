import { Injectable } from '@nestjs/common';
import type { IdempotencyStore } from '../../application/ports/idempotency-store.port';

@Injectable()
export class InMemoryIdempotencyStore implements IdempotencyStore {
  private readonly processedEventIds = new Set<string>();

  isProcessed(eventId: string): Promise<boolean> {
    return Promise.resolve(this.processedEventIds.has(eventId));
  }

  markProcessed(eventId: string): Promise<void> {
    this.processedEventIds.add(eventId);
    return Promise.resolve();
  }
}
