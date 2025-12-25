import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Wallet } from './entities/wallet.entity';

@Module({
  // Register the Wallet entity so TypeORM can inject the Repository
  imports: [TypeOrmModule.forFeature([Wallet])],
  controllers: [WalletController],
  providers: [WalletService],
  // Export WalletService so UserModule can use it for auto-creating wallets on signup
  exports: [WalletService],
})
export class WalletModule {}
