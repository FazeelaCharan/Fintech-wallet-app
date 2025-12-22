import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'SUPER_SECRET_KEY_CHANGE_LATER', // In production, use an environment variable!
      signOptions: { expiresIn: '1h' }, // Wristband expires in 1 hour
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
