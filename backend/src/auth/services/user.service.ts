
import { Injectable, NotFoundException } from '@nestjs/common';
import { from, Observable, catchError, throwError, of,  } from 'rxjs';
import { switchMap , map } from 'rxjs/operators'
import { User } from '../controllers/models/user.interface';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../controllers/models/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from '../controllers/models/friend-request.interface';
import { FriendRequestEntity } from '../controllers/models/friend-request.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FriendRequestEntity) 
        private readonly friendRequestRepository: Repository<FriendRequestEntity>,
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

    hasRequestBeenSendOrReceived(
        creator:User,
        receiver: User,
    ): Observable<boolean> {
        return from(this.friendRequestRepository.findOne({
            where: [
                { creator, receiver},
                { creator: receiver, receiver: creator }
            ]
        })
    ).pipe(
        switchMap((friendRequest: FriendRequest) => {
            if (!friendRequest) return of(false);
            return of(true);
        })
    )
    }
    sendFriendRequest(receiverId: number, creator: User): Observable<FriendRequest | { error: string }> {
        if (receiverId === creator.id) return of({ error: 'It is not possible to add yourself!' });
    
        return from(this.userRepository.findOne({ where: { id: receiverId } })).pipe(
            switchMap((receiver: User | null) => {
                if (!receiver) return of({ error: 'Receiver not found!' });
    
                return this.hasRequestBeenSendOrReceived(creator, receiver).pipe(
                    switchMap((requestExists: boolean) => {
                        if (requestExists) {
                            return of({ error: 'A friend request has already been sent or received!' });
                        }
    
                        const friendRequest: FriendRequest = {
                            creator,
                            receiver,
                            status: 'pending'
                        };
    
                        return from(this.friendRequestRepository.save(friendRequest));
                    })
                );
            }),
            catchError(() => of({ error: 'An error occurred while sending the friend request' }))
        );
    }
    
}
