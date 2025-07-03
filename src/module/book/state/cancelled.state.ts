import { BookStateInterface } from './book-state.interface';

export class CancelledState implements BookStateInterface {
  booked(): string {
    return 'Reserva cancelada, no se puede reservar de nuevo';
  }

  cancelled(): string {
    return 'Reserva ya cancelada';
  }

  pending(): string {
    return 'Reserva pendiente, no se puede cancelar';
  }
}
