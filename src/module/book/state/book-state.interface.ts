export interface BookStateInterface {
  booked(): string;
  cancelled(): string;
  pending(): string;
}
