import { Injectable, NestMiddleware } from '@nestjs/common';
import multer from 'multer'; // Default import
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

  private upload = multer({ storage: this.storage });

  use(req: any, res: any, next: () => void) {
    console.log('FileUploadMiddleware: Starting...'); // Логирование начала

    try {
      this.upload.single('image')(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
          console.error('FileUploadMiddleware: Multer error:', err); // Логирование ошибок Multer
          return res.status(400).json({ error: 'File upload failed' });
        } else if (err) {
          console.error('FileUploadMiddleware: Unknown error:', err); // Логирование других ошибок
          return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('FileUploadMiddleware: File processed successfully'); // Логирование успешной обработки
        next(); // Всегда вызываем next(), даже если файл отсутствует
      });
    } catch (error) {
      console.error('FileUploadMiddleware: Unexpected error:', error); // Логирование неожиданных ошибок
      res.status(500).json({ error: 'Unexpected error in middleware' });
    }
  }
}