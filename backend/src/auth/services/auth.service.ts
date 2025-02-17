import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Observable, from, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../controllers/models/user.entity';
import { User } from '../controllers/models/user.class';
import { MailerService } from 'src/mailer/mailer.service';  // Import MailerService

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private jwtService: JwtService,
        private readonly mailerService: MailerService,  // Injection du service de mail
    ) {}

    hashPassword(password: string): Observable<string> {
        return from(bcrypt.hash(password, 12));
    }

    registerAccount(user: User): Observable<User> {
        const { firstName, lastName, email, password } = user;

        return this.hashPassword(password).pipe(
            switchMap((hashedPassword: string) =>
                from(
                    this.userRepository.save({
                        firstName,
                        lastName,
                        email,
                        password: hashedPassword,
                    }),
                ).pipe(
                    map((user: User) => {
                        delete user.password;

                        // Après avoir créé l'utilisateur, envoyer un email de confirmation
                        this.sendConfirmationEmail(user.email);

                        return user;
                    }),
                    catchError(err => {
                        return throwError(() => new HttpException('Erreur lors de l\'inscription', HttpStatus.INTERNAL_SERVER_ERROR));
                    }),
                ),
            ),
        );
    }

    // Méthode pour envoyer un e-mail de confirmation avec un lien sécurisé
    private async sendConfirmationEmail(userEmail: string) {
        // Créer un token JWT pour la confirmation de l'email
        const token = await this.jwtService.signAsync({ email: userEmail }, { expiresIn: '1h' });

        // URL de confirmation
        const confirmationUrl = `http://localhost:3000/auth/confirm?token=${token}`;

        // Envoi de l'email de confirmation
        await this.mailerService.sendSignupConfirmation(userEmail, confirmationUrl);
    }

    //  Vérification si l'utilisateur existe déjà
    validateUser(email: string, password: string): Observable<User> {
        return from(
            this.userRepository.findOne({
                where: { email },
                select: ['id', 'firstName', 'lastName', 'email', 'password', 'role'],
            }),
        ).pipe(
            switchMap((user: User | null) => {
                if (!user) {
                    return throwError(() =>
                        new HttpException(
                            { status: HttpStatus.NOT_FOUND, error: 'Email non trouvé' },
                            HttpStatus.NOT_FOUND,
                        ),
                    );
                }

                return from(bcrypt.compare(password, user.password)).pipe(
                    map((isValidPassword: boolean) => {
                        if (!isValidPassword) {
                            throw new HttpException(
                                { status: HttpStatus.UNAUTHORIZED, error: 'Mot de passe incorrect' },
                                HttpStatus.UNAUTHORIZED,
                            );
                        }
                        delete user.password;
                        return user;
                    }),
                );
            }),
            catchError(err => {
                return throwError(() => err);
            }),
        );
    }

    // Méthode de connexion
    login(user: User): Observable<string> {
        const { email, password } = user;

        return this.validateUser(email, password).pipe(
            switchMap((validatedUser: User) => {
                if (!validatedUser) {
                    return throwError(() =>
                        new HttpException(
                            { status: HttpStatus.UNAUTHORIZED, error: 'Invalid Credentials' },
                            HttpStatus.UNAUTHORIZED,
                        ),
                    );
                }
                return from(this.jwtService.signAsync({ user: validatedUser }));
            }),
            catchError(err => {
                return throwError(() => err);
            }),
        );
    }
}
