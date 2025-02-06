import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Request, BadRequestException, Logger, NotFoundException, Res, Get } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, saveImageToStorage, removeFile } from '../helpers/image-storage';
import { UserService } from '../services/user.service';
import { switchMap, catchError, of } from 'rxjs';
import { join } from 'path';
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
        const imageName = await this.userService.findImageNameByUserId(userId).toPromise();

        if (!imageName) {
            throw new NotFoundException('Aucune image trouvée pour cet utilisateur');
        }

        const imagePath = join(process.cwd(), 'images', imageName);

        try {
            await fs.access(imagePath);
            res.sendFile(imageName, { root: './images' });
        } catch {
            throw new NotFoundException('Image non trouvée');
        }
    }
}
