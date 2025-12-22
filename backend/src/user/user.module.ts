import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

@Module({
  // This imports the User table into this module's scope
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  // We export it so other modules (like Auth) can use it later
  exports: [UserService],
})
export class UserModule {}
