import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtService } from '../common/services/jwt.service';
import { AuthController } from './controllers/auth.controllers';
import { PasswordService } from 'src/common/services/password.services';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, JwtService],
})
export class AuthModule {}