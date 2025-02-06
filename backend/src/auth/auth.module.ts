import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './controllers/models/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

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
  controllers: [AuthController, UserController],
  providers: [AuthService, JwtGuard, JwtStrategy , RolesGuard, UserService],
  exports: [AuthService, UserService]
})
export class AuthModule {}
