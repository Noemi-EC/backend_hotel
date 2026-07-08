import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from '../../book/entity/book.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'book_id', unique: true })
  bookId: number;

  @OneToOne(() => Book)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'card_last_digits', length: 4, nullable: true })
  cardLastDigits: string;

  @Column({ length: 20, default: 'completed' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
