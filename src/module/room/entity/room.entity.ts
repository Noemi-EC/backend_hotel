import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Hotel } from '../../hotel/entity/hotel.entity';

export enum RoomCategory {
  SUITE = 'suite',
  DUPLEX = 'duplex',
  STANDARD = 'standard',
  DELUXE = 'deluxe',
}

export enum RoomStatus {
  DISPONIBLE = 'disponible',
  OCUPADA = 'ocupada',
  LIMPIEZA = 'limpieza',
  MANTENIMIENTO = 'mantenimiento',
}

@Entity('rooms')
@Unique(['hotelId', 'code'])
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'hotel_id' })
  hotelId: number;

  @ManyToOne(() => Hotel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @Column({ length: 20 })
  code: string;

  @Column({ length: 20, default: RoomStatus.DISPONIBLE })
  status: string;

  @Column()
  capacity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ length: 20 })
  category: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
