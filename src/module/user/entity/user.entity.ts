import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Company } from '../../company/entity/company.entity';
import { Hotel } from '../../hotel/entity/hotel.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 20, default: 'CUSTOMER' })
  role: string;

  @Column({ name: 'company_id', nullable: true })
  companyId: number;

  @ManyToOne(() => Company, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'hotel_id', nullable: true })
  hotelId: number;

  @ManyToOne(() => Hotel, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
