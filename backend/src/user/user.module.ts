import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
// 1. We import the WalletModule here
import { WalletModule } from '../wallet/wallet.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // 2. We add WalletModule to the imports list
    WalletModule, 
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}