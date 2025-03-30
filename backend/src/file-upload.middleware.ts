import { Injectable, NestMiddleware } from '@nestjs/common';
import multer from 'multer'; 
import * as path from 'path';

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  private storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });

  private upload = multer({ storage: this.storage });

  use(req: any, res: any, next: () => void) {
    console.log('Processing file upload...');

    this.upload.single('image')(req, res, (err: any) => {
      if (err) {
        console.error('File upload error:', err); 
        return res.status(400).json({ error: 'File upload failed' });
      }
      next();
    });
  }
}