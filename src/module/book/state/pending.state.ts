import { BookStateInterface } from './book-state.interface';
import { BookContext } from '../book-context.class';
import { BookedState } from './booked.state';
import { CancelledState } from './cancelled.state';

export class PendingState implements BookStateInterface {
  booked(context: BookContext): string {
    context.setState(new BookedState());
    return 'Reserva cancelada, no se puede reservar de nuevo';
  }

  cancelled(context: BookContext): string {
    context.setState(new CancelledState());
    return 'Reserva ya cancelada';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pending(context: BookContext): string {
    return 'Reserva pendiente, no se puede cancelar';
  }

  canTransitionTo(newState: string): boolean {
    // Desde pendiente se puede confirmar o cancelar
    return newState === 'booked' || newState === 'cancelled';
  }
}
