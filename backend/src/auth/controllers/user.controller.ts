import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Request, BadRequestException, Logger, NotFoundException, Res, Get } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, saveImageToStorage, removeFile } from '../helpers/image-storage';
import { UserService } from '../services/user.service';
import { switchMap, catchError, of, lastValueFrom } from 'rxjs';
import path, { join } from 'path';
import * as fs from 'fs/promises';

@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private userService: UserService) {}

    @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', saveImageToStorage))
    async uploadImage(@UploadedFile() file: Express.Multer.File, @Request() req): Promise<any> {
        if (!file) {
            throw new BadRequestException('❌ Aucun fichier téléchargé ou type invalide.');
        }

        const userId = req.user.id;
        const fullImagePath = join(process.cwd(), 'images', file.filename);

        return isFileExtensionSafe(fullImagePath).pipe(
            switchMap((isFileLegit: boolean) => {
                if (!isFileLegit) {
                    removeFile(fullImagePath);
                    throw new BadRequestException('❌ Type de fichier non autorisé.');
                }
                return this.userService.updateUserImageById(userId, fullImagePath).pipe(
                    switchMap(() => of({
                        message: '✅ Image téléchargée avec succès',
                        fileName: file.filename,
                        imageUrl: `/images/${file.filename}`,
                    }))
                );
            }),
            catchError((err) => {
                removeFile(fullImagePath);
                this.logger.error(`Erreur lors de la mise à jour de l'image: ${err.message}`);
                throw new BadRequestException('Erreur lors de la mise à jour de l\'image.');
            })
        );
    }

    @UseGuards(JwtGuard)
    @Get('image')
async findImage(@Request() req, @Res() res): Promise<void> {
    const userId = req.user.id;

    try {
        // Récupération du nom de l'image pour l'utilisateur
        const imageName = await lastValueFrom(this.userService.findImageNameByUserId(userId));

        if (!imageName) {
            console.log('❌ Aucun nom d\'image trouvé pour cet utilisateur');
            throw new NotFoundException('Aucune image trouvée pour cet utilisateur');
        }

        // Vérification du chemin complet de l'image (sans afficher le chemin dans le terminal)
        const imagePath = imageName.startsWith('/') ? imageName : path.join(process.cwd(), 'images', imageName);

        // Vérifier si le fichier existe sur le disque
        try {
            await fs.access(imagePath);
        } catch (err) {
            console.log('❌ L\'image n\'existe pas sur le disque:', err);
            throw new NotFoundException('Image non trouvée');
        }

        // Envoyer l'image
        return res.sendFile(imagePath);
    } catch (error) {
        console.error('❌ Erreur lors de la récupération de l\'image:', error);
        throw new NotFoundException('Image non trouvée');
    }
}



}
