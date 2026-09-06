import { EventEmitter } from "events";

type EventMap = {
  "booking.created": { bookingId: string };
  "booking.confirmed": { bookingId: string };
  "booking.cancelled": { bookingId: string };
  "quotation.sent": { quotationId: string };
  "quotation.accepted": { quotationId: string };
  "quotation.expired": { quotationId: string };
  "enquiry.created": { enquiryId: string };
  "stock.moved": { ingredientId: string; movementType: string };
};

class TypedEventEmitter {
  private emitter = new EventEmitter();

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]) {
    this.emitter.emit(event, payload);
  }

  on<K extends keyof EventMap>(event: K, listener: (payload: EventMap[K]) => void | Promise<void>) {
    this.emitter.on(event, async (payload) => {
      try {
        await listener(payload);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }
}

export const appEvents = new TypedEventEmitter();
