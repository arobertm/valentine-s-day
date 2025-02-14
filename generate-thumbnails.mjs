import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

 
const inputDir = path.join(__dirname, 'public', 'photos');
const outputDir = path.join(__dirname, 'public', 'photos', 'thumbnails');

 
if (!fs.existsSync(inputDir)) {
  fs.mkdirSync(inputDir, { recursive: true });
  console.log('Directorul photos a fost creat');
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('Directorul thumbnails a fost creat');
}

fs.readdirSync(inputDir).forEach(file => {
  if (file === 'thumbnails' || !file.match(/\.(jpg|jpeg|png|gif)$/i)) return;

  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);

  sharp(inputPath)
    .resize(300, 300, {  
      fit: 'cover', 
      position: 'center' 
    })
    .jpeg({ quality: 80 })  
    .toFile(outputPath)
    .then(() => {
      console.log(`Thumbnail generat pentru ${file}`);
    })
    .catch(err => {
      console.error(`Eroare la procesarea ${file}:`, err);
    });
}); 