import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  // We add 'manager' as an optional parameter
  async create(data: { userId: string }, manager?: EntityManager): Promise<Wallet> {
    const walletData = {
      userId: data.userId,
      balance: 0,
      currency: 'USD',
    };

    // If a manager is provided (from a transaction), use it. 
    // Otherwise, use the standard repository.
    if (manager) {
      return await manager.save(Wallet, walletData);
    }
    
    const wallet = this.walletRepository.create(walletData);
    return await this.walletRepository.save(wallet);
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({ where: { userId } });
  }
}