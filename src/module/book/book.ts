import { BookStateInterface } from './state/book-state.interface';

export class Book {
  private state: BookStateInterface;

  constructor(state: BookStateInterface) {
    this.state = state;
  }

  public setState(state: BookStateInterface): void {
    this.state = state;
  }

  public booked(): string {
    return this.state.booked();
  }

  public cancelled(): string {
    return this.state.cancelled();
  }

  public pending(): string {
    return this.state.pending();
  }
}
