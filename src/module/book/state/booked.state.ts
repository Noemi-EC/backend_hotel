/* eslint-disable @typescript-eslint/no-unused-vars */
import { BookStateInterface } from './book-state.interface';
import { BookContext } from '../book-context.class';
import { CancelledState } from './cancelled.state';
import { PendingState } from './pending.state';

export class BookedState implements BookStateInterface {
  booked(context: BookContext): string {
    return 'Reserva ya confirmada';
  }

  cancelled(context: BookContext): string {
    context.setState(new CancelledState());
    return 'Reserva cancelada';
  }

  pending(context: BookContext): string {
    context.setState(new PendingState());
    return 'No se puede cambiar una reserva confirmada a pendiente';
  }

  canTransitionTo(newState: string): boolean {
    return newState === 'cancelled';
  }
}
