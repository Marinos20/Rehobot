// 


import { Injectable, NotFoundException } from '@nestjs/common';
import { from, map, Observable, catchError, throwError } from 'rxjs';
import { User } from '../controllers/models/user.interface';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../controllers/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    findUserById(id: number): Observable<User> {
        return from(
            this.userRepository.findOne({ where: { id }, relations: ['feedPosts'] })
        ).pipe(
            map((user: User | null) => {
                if (!user) throw new NotFoundException('Utilisateur non trouvé');
                delete user.password;
                return user;
            }),
            catchError(() => throwError(() => new NotFoundException('Utilisateur non trouvé')))
        );
    }

    updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
        return from(this.userRepository.update(id, { imagePath })).pipe(
            catchError(() => throwError(() => new NotFoundException('Mise à jour impossible, utilisateur non trouvé')))
        );
    }

    findImageNameByUserId(id: number): Observable<string> {
        return from(this.userRepository.findOne({ where: { id } })).pipe(
            map((user: User | null) => {
                if (!user) throw new NotFoundException('Utilisateur non trouvé');
                delete user.password; 
                return user.imagePath;
            }),
            catchError(() => throwError(() => new NotFoundException('Utilisateur non trouvé')))
        );
    }
}
