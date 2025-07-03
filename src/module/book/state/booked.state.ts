import { BookStateInterface } from './book-state.interface';

export class BookedState implements BookStateInterface {
  booked(): string {
    return 'Reserva confirmada';
  }

  cancelled(): string {
    return 'Reserva cancelada';
  }

  pending(): string {
    return 'Reserva pendiente';
  }
}
