import { BookContext } from '../book-context.class';

export interface BookStateInterface {
  booked(context: BookContext): string;
  cancelled(context: BookContext): string;
  pending(context: BookContext): string;
  canTransitionTo(newState: string): boolean;
}
