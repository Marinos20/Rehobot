import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Observable,from } from 'rxjs';
import {map, switchMap } from 'rxjs/operators';
// import { User } from '../controllers/models/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../controllers/models/user.entity';
import { Repository } from 'typeorm';
import { User } from '../controllers/models/user.interface';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity> ,) {

    }
    hashPassword(password: string) : Observable<string> {
        return from(bcrypt.hash(password, 12));
    }

    registerAccount(user : User) : Observable<User> {
        const { firstName, lastName , email , password} = user;

        return this.hashPassword(password).pipe(
            switchMap((hashPassword : string) => {
                return from(
                    this.userRepository.save({
                    firstName,
                    lastName,
                    email,
                    password: hashPassword,

                }),
            ).pipe(
              map((user: User) => {
              delete user.password;
              return user;
                    }),
                );

            }),
        )
    }
}
