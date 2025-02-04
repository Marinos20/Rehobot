import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import path = require('path');

type ValidFileExtension = 'png' | 'jpg' | 'jpeg';
type ValidMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: ValidFileExtension[] = ['jpeg', 'jpg', 'png'];
const validMimeTypes: ValidMimeType[] = ['image/jpeg', 'image/jpg', 'image/png'];

export const saveImageToStorage = {
    storage: diskStorage({
        destination: './images', //  le répertoire vers un dossier local
        filename: (req, file, cb) => {
            const fileExtension: string = path.extname(file.originalname).toLowerCase().replace('.', '');
            const fileName: string = uuidv4() + '.' + fileExtension;
            cb(null, fileName);
        }
    }),
    fileFilter: (req, file, cb) => { 
        if (validMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Type de fichier non autorisé"), false);
        }
    }
};
