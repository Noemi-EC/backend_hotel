import { BookStateInterface } from './state/book-state.interface';

export class BookContext {
  private state: BookStateInterface;

  constructor(initialState: BookStateInterface) {
    this.state = initialState;
  }

  setState(state: BookStateInterface): void {
    this.state = state;
  }

  booked(): string {
    return this.state.booked(this);
  }

  cancelled(): string {
    return this.state.cancelled(this);
  }

  pending(): string {
    return this.state.pending(this);
  }

  canTransitionTo(newState: string): boolean {
    return this.state.canTransitionTo(newState);
  }
}
