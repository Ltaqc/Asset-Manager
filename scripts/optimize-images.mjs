import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import path from 'path';

const INPUT_DIR = 'attached_assets';
const OUTPUT_DIR = 'attached_assets/optimized';

const HERO_MAX_WIDTH = 1920;
const GALLERY_MAX_WIDTH = 1200;
const QUALITY = 80;

await mkdir(OUTPUT_DIR, { recursive: true });

const files = await readdir(INPUT_DIR);
const imageFiles = files.filter(f => /\.(png|jpg|jpeg|JPG)$/i.test(f) && !f.startsWith('.'));

let totalOriginal = 0;
let totalOptimized = 0;

for (const file of imageFiles) {
  const inputPath = path.join(INPUT_DIR, file);
  const fileStat = await stat(inputPath);
  
  if (fileStat.isDirectory()) continue;
  
  const baseName = path.parse(file).name;
  const outputPath = path.join(OUTPUT_DIR, `${baseName}.webp`);
  
  const isHero = file.includes('13_52_16_1770462591520') || file.includes('13_40_53');
  const maxWidth = isHero ? HERO_MAX_WIDTH : GALLERY_MAX_WIDTH;
  
  try {
    const metadata = await sharp(inputPath).metadata();
    const needsResize = metadata.width > maxWidth;
    
    let pipeline = sharp(inputPath);
    
    if (needsResize) {
      pipeline = pipeline.resize(maxWidth, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    pipeline = pipeline.sharpen({ sigma: 0.5, flat: 1, jagged: 2 });
    
    await pipeline.webp({ quality: QUALITY, effort: 4 }).toFile(outputPath);
    
    const outputStat = await stat(outputPath);
    totalOriginal += fileStat.size;
    totalOptimized += outputStat.size;
    
    const savings = ((1 - outputStat.size / fileStat.size) * 100).toFixed(1);
    console.log(`${file}: ${(fileStat.size/1024).toFixed(0)}KB → ${(outputStat.size/1024).toFixed(0)}KB (${savings}% saved) [${metadata.width}→${needsResize ? maxWidth : metadata.width}px]`);
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
}

console.log(`\nTotal: ${(totalOriginal/1024/1024).toFixed(1)}MB → ${(totalOptimized/1024/1024).toFixed(1)}MB (${((1-totalOptimized/totalOriginal)*100).toFixed(1)}% saved)`);
