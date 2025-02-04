import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors, Request } from '@nestjs/common';

import { JwtGuard } from '../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImageToStorage } from '../helpers/image-storage';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
    constructor(private userService : UserService) {}


        @UseGuards(JwtGuard)
        @Post('upload')
        @UseInterceptors(FileInterceptor('file' , saveImageToStorage))
        uploadImage(@UploadedFile() file : Express.Multer.File, @Request() req):any {
            return;
        }
}






