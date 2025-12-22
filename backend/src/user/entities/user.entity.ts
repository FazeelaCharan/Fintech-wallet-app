import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// This tells TypeORM that this class represents a table in our Database
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // 'select: false' means we don't accidentally send the password to the frontend
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  // For 2FA (Two-Factor Authentication)
  @Column({ nullable: true, select: false })
  twoFactorSecret: string;

  @Column({ default: false })
  isTwoFactorEnabled: boolean;

  // KYC (Know Your Customer) - used in Fintech to verify identity
  @Column({
    type: 'enum',
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  })
  kycStatus: string;

  @Column({
    type: 'enum',
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
