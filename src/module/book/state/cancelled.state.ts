/* eslint-disable @typescript-eslint/no-unused-vars */
import { BookStateInterface } from './book-state.interface';
import { BookContext } from '../book-context.class';

export class CancelledState implements BookStateInterface {
  booked(context: BookContext): string {
    return 'No se puede confirmar una reserva cancelada';
  }

  cancelled(context: BookContext): string {
    return 'La reserva ya está cancelada';
  }

  pending(context: BookContext): string {
    return 'No se puede cambiar una reserva cancelada a pendiente';
  }

  canTransitionTo(newState: string): boolean {
    // Una reserva cancelada no puede cambiar a ningún otro estado
    return false;
  }
}
