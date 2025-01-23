import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './controllers/models/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';

@Module({
  imports : [
    JwtModule.registerAsync({
    useFactory: () => ({
      secret : process.env.JWT_SECRET,
      signOptions : { expiresIn: '3600s'},
    }),
   }),
   TypeOrmModule.forFeature([UserEntity]),
],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, JwtStrategy],
})
export class AuthModule {}
