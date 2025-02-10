

// import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Request, BadRequestException, Logger, Res, Get } from '@nestjs/common';
// import { JwtGuard } from '../guards/jwt.guard';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { isFileExtensionSafe, saveImageToStorage, removeFile } from '../helpers/image-storage';
// import { UserService } from '../services/user.service';
// import { switchMap, catchError, of, Observable } from 'rxjs';
// import { join } from 'path';

// @Controller('user')
// export class UserController {
//     private readonly logger = new Logger(UserController.name);  // Logger pour afficher l'erreur dans les logs du serveur

//     constructor(private userService: UserService) {}

//     @UseGuards(JwtGuard)
//     @Post('upload')
//     @UseInterceptors(FileInterceptor('file', saveImageToStorage))
//     async uploadImage(@UploadedFile() file: Express.Multer.File, @Request() req): Promise<any> {
//         if (!file) {
//             throw new BadRequestException('Aucun fichier téléchargé ou fichier invalide. Veuillez télécharger une image.');
//         }

//         const userId = req.user.id;
//         const fullImagePath = join(process.cwd(), 'images', file.filename);

//         // Validation du fichier avant de le sauvegarder
//         return isFileExtensionSafe(fullImagePath).pipe(
//             switchMap((isFileLegit: boolean) => {
//                 if (isFileLegit) {
//                     return this.userService.updateUserImageById(userId, fullImagePath).pipe(
//                         switchMap(() => {
//                             return of({
//                                 message: 'Image téléchargée avec succès',
//                                 fileName: file.filename,
//                                 imageUrl: `/images/${file.filename}`,
//                             });
//                         }),
//                         catchError((err) => {
//                             removeFile(fullImagePath);
//                             // Log l'erreur avant de renvoyer une exception
//                             this.logger.error(`Erreur lors de la mise à jour de l'image: ${err.message}`);
//                             throw new BadRequestException('Erreur lors de la mise à jour de l\'image');
//                         })
//                     );
//                 } else {
//                     removeFile(fullImagePath);
//                     const errorMsg = `ERROR [ExceptionsHandler] Type de fichier non autorisé. Types valides: image/jpeg, image/jpg, image/png`;
//                     this.logger.error(errorMsg);  // Affiche l'erreur dans les logs
//                     throw new BadRequestException(errorMsg);  // Renvoie un message d'erreur
//                 }
//             }),
//             catchError((err) => {
//                 removeFile(fullImagePath);
//                 const errorMsg = `ERROR [ExceptionsHandler] Erreur lors de la validation du fichier: ${err.message}`;
//                 // Log l'erreur générale
//                 this.logger.error(errorMsg);
//                 throw new BadRequestException(`Erreur lors de la validation du fichier: ${err.message}`);
//             })
//         );
//     }

//     @UseGuards(JwtGuard)
//     @Get('image') 
//     findImage(@Request() req, @Res() res) : Observable<Object> {
//         const userId = req.user.id;
//         return this.userService.findImageNameByUserId(userId).pipe(
//             switchMap((imageName:string) => {
//                 return of(res.sendFile(imageName, { root : './images'}))
//             })
//         )
//     }


//     @UseGuards(JwtGuard)
//     @Get('image-name') 
//     findUserImageName(@Request() req, @Res() res) : Observable<{imageName: string}> {
//         const userId = req.user.id;
//         return this.userService.findImageNameByUserId(userId).pipe(
//             switchMap((imageName:string) => {
//                 return of( { imageName })
//             })
//         )
//     }
// }



import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Request, BadRequestException, Logger, Res, Get } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, saveImageToStorage, removeFile } from '../helpers/image-storage';
import { UserService } from '../services/user.service';
import { switchMap, catchError, of, Observable } from 'rxjs';
import { join } from 'path';
import { promises as fs } from 'fs';

@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name);  // Logger pour afficher l'erreur dans les logs du serveur

    constructor(private userService: UserService) {}

    @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', saveImageToStorage))
    async uploadImage(@UploadedFile() file: Express.Multer.File, @Request() req): Promise<any> {
        if (!file) {
            throw new BadRequestException('Aucun fichier téléchargé ou fichier invalide. Veuillez télécharger une image.');
        }

        const userId = req.user.id;
        const fullImagePath = join(process.cwd(), 'images', file.filename);

        // Validation du fichier avant de le sauvegarder
        return isFileExtensionSafe(fullImagePath).pipe(
            switchMap((isFileLegit: boolean) => {
                if (isFileLegit) {
                    return this.userService.updateUserImageById(userId, fullImagePath).pipe(
                        switchMap(() => {
                            return of({
                                message: 'Image téléchargée avec succès',
                                fileName: file.filename,
                                imageUrl: `/images/${file.filename}`,
                            });
                        }),
                        catchError((err) => {
                            removeFile(fullImagePath);
                            // Log l'erreur avant de renvoyer une exception
                            this.logger.error(`Erreur lors de la mise à jour de l'image: ${err.message}`);
                            throw new BadRequestException('Erreur lors de la mise à jour de l\'image');
                        })
                    );
                } else {
                    removeFile(fullImagePath);
                    const errorMsg = `ERROR [ExceptionsHandler] Type de fichier non autorisé. Types valides: image/jpeg, image/jpg, image/png`;
                    this.logger.error(errorMsg);  // Affiche l'erreur dans les logs
                    throw new BadRequestException(errorMsg);  // Renvoie un message d'erreur
                }
            }),
            catchError((err) => {
                removeFile(fullImagePath);
                const errorMsg = `ERROR [ExceptionsHandler] Erreur lors de la validation du fichier: ${err.message}`;
                // Log l'erreur générale
                this.logger.error(errorMsg);
                throw new BadRequestException(`Erreur lors de la validation du fichier: ${err.message}`);
            })
        );
    }

    @UseGuards(JwtGuard)
    @Get('image') 
    findImage(@Request() req, @Res() res): Observable<Object> {
        const userId = req.user.id;
        return this.userService.findImageNameByUserId(userId).pipe(
            switchMap((imageName: string) => {
                const imagePath = join(process.cwd(), 'images', imageName);
                return this.checkFileExists(imagePath).pipe(
                    switchMap((exists: boolean) => {
                        if (exists) {
                            return of(res.sendFile(imageName, { root: './images' }));
                        } else {
                            this.logger.error(`Image introuvable: ${imageName}`);
                            throw new BadRequestException('Image non trouvée.');
                        }
                    }),
                    catchError((err) => {
                        this.logger.error(`Erreur lors de l\'envoi de l'image: ${err.message}`);
                        throw new BadRequestException('Erreur lors de l\'envoi de l\'image.');
                    })
                );
            })
        );
    }

    @UseGuards(JwtGuard)
    @Get('image-name') 
    findUserImageName(@Request() req, @Res() res): Observable<{ imageName: string }> {
        const userId = req.user.id;
        return this.userService.findImageNameByUserId(userId).pipe(
            switchMap((imageName: string) => {
                return of({ imageName });
            }),
            catchError((err) => {
                this.logger.error(`Erreur lors de la récupération du nom d'image: ${err.message}`);
                throw new BadRequestException('Erreur lors de la récupération du nom de l\'image.');
            })
        );
    }

    private checkFileExists(filePath: string): Observable<boolean> {
        return new Observable<boolean>((observer) => {
            fs.access(filePath)
                .then(() => {
                    observer.next(true);  // Le fichier existe
                    observer.complete();
                })
                .catch(() => {
                    observer.next(false);  // Le fichier n'existe pas
                    observer.complete();
                });
        });
    }
}
