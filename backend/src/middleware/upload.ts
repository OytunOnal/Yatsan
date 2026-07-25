import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs/promises';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

// Multer configuration with image processing
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 15
  }
});

// Image processing function to resize and optimize images
export const processImage = async (filePath: string): Promise<void> => {
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Only process if image is larger than 1920px width or 1080px height
    if (metadata.width && metadata.width > 1920) {
      await image
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 85 })
        .toFile(filePath + '.tmp');

      // Replace original with processed file
      await fs.unlink(filePath);
      await fs.rename(filePath + '.tmp', filePath);
    } else {
      // Just optimize quality without resizing
      await image
        .jpeg({ quality: 85 })
        .toFile(filePath + '.tmp');

      await fs.unlink(filePath);
      await fs.rename(filePath + '.tmp', filePath);
    }
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};
