const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, 'assets', 'images');
const BACKUP_DIR = path.join(IMAGES_DIR, 'original_backup');

async function convertImages() {
  try {
    // Ensure backup directory exists
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const files = await fs.promises.readdir(IMAGES_DIR);
    console.log(`Scanning assets/images folder... Found ${files.length} items.`);

    for (const file of files) {
      const filePath = path.join(IMAGES_DIR, file);
      const stat = await fs.promises.stat(filePath);

      if (stat.isDirectory()) {
        continue;
      }

      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.jfif'].includes(ext)) {
        const baseName = path.basename(file, ext);
        const webpFileName = `${baseName}.webp`;
        const webpFilePath = path.join(IMAGES_DIR, webpFileName);

        console.log(`Converting ${file} to ${webpFileName}...`);
        
        // Convert using sharp
        await sharp(filePath)
          .webp({ quality: 85 })
          .toFile(webpFilePath);

        console.log(`Successfully converted ${file} to WebP.`);

        // Move original file to original_backup
        const backupFilePath = path.join(BACKUP_DIR, file);
        
        // If file already exists in backup, delete it first to avoid collision
        if (fs.existsSync(backupFilePath)) {
          fs.unlinkSync(backupFilePath);
        }
        
        fs.renameSync(filePath, backupFilePath);
        console.log(`Moved original ${file} to original_backup/`);
      }
    }
    console.log('Image conversion completed successfully!');
  } catch (error) {
    console.error('Error during image conversion:', error);
  }
}

convertImages();
