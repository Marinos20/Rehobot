
// import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Request } from '@nestjs/common';
// import { JwtGuard } from '../guards/jwt.guard';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { isFileExtensionSafe, saveImageToStorage, removeFile } from '../helpers/image-storage';
// import { UserService } from '../services/user.service';
// import { join } from 'path';
// import { switchMap } from 'rxjs';

// @Controller('user')
// export class UserController {
//     constructor(private userService: UserService) {}

//     // Route protégée par le guard JWT 0169475819
//     @UseGuards(JwtGuard)
//     @Post('upload')
//     @UseInterceptors(FileInterceptor('file', saveImageToStorage))  // Assurez-vous que le champ 'file' dans Postman correspond à celui-ci
//     async uploadImage(@UploadedFile() file: Express.Multer.File, @Request() req): Promise<any> {
//         if (!file) {
//             return { message: 'Aucun fichier téléchargé' };
//         }

//         // Logique pour mettre à jour l'image de l'utilisateur dans la base de données
//         const userId = req.user.id;  // Supposons que l'ID de l'utilisateur soit disponible dans req.user, après la vérification JWT
//         const fullImagePath = `/images/${file.filename}`;  // Chemin du fichier téléchargé
//         const imagesFolderPath = join(process.cwd() , 'images');

//         // Mettre à jour l'image dans la base de données
//         await this.userService.updateUserImageById(userId, fullImagePath);

//         return isFileExtensionSafe(fullImagePath).pipe(
//             switchMap((isFileLegit : boolean) => {
//                 if (isFileLegit){
//                     const userId = req.uer.id;
//                     return this.userService.updateUserImageById(userId,fileName)
//                 }
//                 removeFile(fullImagePath);
//                 return { message: 'Image téléchargée avec succès', fileName: file.filename, imageUrl: fullImagePath };
//             })
//         )

       
        
//     }
// }


import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Request, BadRequestException, Logger } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, saveImageToStorage, removeFile } from '../helpers/image-storage';
import { UserService } from '../services/user.service';
import { switchMap, catchError, of } from 'rxjs';
import { join } from 'path';

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
}
