import { Injectable, NestMiddleware } from '@nestjs/common';
import multer from 'multer';
import path from 'path';
import { join } from 'path';

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  private storage = multer.diskStorage({
    destination: join(__dirname, '..', 'uploads'),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });

  private upload = multer({
    storage: this.storage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      // if (!allowedTypes.includes(file.mimetype)) {
      //   return cb(new Error('Invalid file type'), false);
      // }
      cb(null, true);
    },
  });

  use(req: any, res: any, next: () => void) {
    console.log('FileUploadMiddleware: Starting...');

    try {
      this.upload.single('image')(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
          console.error('FileUploadMiddleware: Multer error:', err);
          return res.status(400).json({ error: 'File upload failed' });
        } else if (err) {
          console.error('FileUploadMiddleware: Unknown error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('FileUploadMiddleware: File processed successfully');
        next();
      });
    } catch (error) {
      console.error('FileUploadMiddleware: Unexpected error:', error);
      res.status(500).json({ error: 'Unexpected error in middleware' });
    }
  }
}