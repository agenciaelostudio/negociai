/**
 * Reduz prints em public/screenshots (evita travar o dev server).
 * Uso: node scripts/compress-screenshots.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const dir = path.join(process.cwd(), "public", "screenshots");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png"));

for (const file of files) {
  const input = path.join(dir, file);
  const base = file.replace(/\.png$/i, "");
  const webpOut = path.join(dir, `${base}.webp`);

  await sharp(input)
    .resize(780, null, { withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(webpOut);

  const before = fs.statSync(input).size;
  const after = fs.statSync(webpOut).size;
  console.log(`${file} → ${base}.webp (${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB)`);
}

console.log("Feito. Atualize conversation-gallery para usar .webp");
