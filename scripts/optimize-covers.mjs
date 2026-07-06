import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, copyFileSync, readdirSync, unlinkSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const contentDir = path.join(root, "src/content");
const publicDir = path.join(root, "public");
const backupDir = path.join(root, "public-images-originals");

const MAX_WIDTH = 1600;
const QUALITY = 80;

function walk(dir, exts) {
  let out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(full, exts));
    else if (exts.some(e => entry.name.toLowerCase().endsWith(e))) out.push(full);
  }
  return out;
}

const mdFiles = walk(contentDir, [".md"]);

const imageRefs = new Map(); // absolutePath -> [{md, raw}]

for (const md of mdFiles) {
  const text = readFileSync(md, "utf8");
  const match = text.match(/^image:\s*(.+)$/m);
  if (!match) continue;
  const raw = match[1].trim();
  const decoded = decodeURIComponent(raw);
  const abs = path.join(publicDir, decoded.replace(/^\//, ""));
  if (!imageRefs.has(abs)) imageRefs.set(abs, []);
  imageRefs.get(abs).push({ md, raw });
}

console.log(`${imageRefs.size} images de couverture uniques trouvées.\n`);

let totalBefore = 0, totalAfter = 0, done = 0, skippedAlready = 0;

for (const [absPath, refs] of imageRefs) {
 try {
  const parsed = path.parse(absPath);
  const alreadyWebp = parsed.ext.toLowerCase() === ".webp";
  const outPath = path.join(parsed.dir, parsed.name + ".webp");

  if (!existsSync(absPath)) {
    if (existsSync(outPath)) {
      skippedAlready++;
      for (const ref of refs) {
        const text = readFileSync(ref.md, "utf8");
        const newDecoded = "/" + path.relative(publicDir, outPath).split(path.sep).join("/");
        const newRaw = newDecoded.split("/").map(encodeURIComponent).join("/");
        if (ref.raw !== newRaw) {
          const updated = text.replace(`image: ${ref.raw}`, `image: ${newRaw}`);
          writeFileSync(ref.md, updated);
        }
      }
      continue;
    }
    console.log(`MANQUANT: ${absPath}`);
    continue;
  }

  if (alreadyWebp) {
    // Déjà en webp (converti lors d'une exécution précédente, ou déjà optimisé à la source) : on ne retouche pas.
    skippedAlready++;
    continue;
  }

  const before = statSync(absPath).size;
  const relFromPublic = path.relative(publicDir, absPath);
  const backupPath = path.join(backupDir, relFromPublic);
  mkdirSync(path.dirname(backupPath), { recursive: true });
  if (!existsSync(backupPath)) copyFileSync(absPath, backupPath);

  const meta = await sharp(absPath).metadata();
  const width = meta.width > MAX_WIDTH ? MAX_WIDTH : meta.width;

  const buffer = await sharp(absPath)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer();

  if (!alreadyWebp) unlinkSync(absPath);
  writeFileSync(outPath, buffer);

  const after = statSync(outPath).size;
  totalBefore += before;
  totalAfter += after;
  done++;

  console.log(`${relFromPublic} : ${(before/1024).toFixed(0)} Ko -> ${(after/1024).toFixed(0)} Ko`);

  // Mettre à jour les .md tout de suite (évite les liens cassés en cas d'interruption)
  for (const ref of refs) {
    const text = readFileSync(ref.md, "utf8");
    const newDecoded = "/" + path.relative(publicDir, outPath).split(path.sep).join("/");
    const newRaw = newDecoded.split("/").map(encodeURIComponent).join("/");
    if (ref.raw !== newRaw) {
      const updated = text.replace(`image: ${ref.raw}`, `image: ${newRaw}`);
      writeFileSync(ref.md, updated);
    }
  }
 } catch (err) {
  console.log(`ERREUR sur ${absPath}: ${err.message}`);
 }
}

console.log(`\n${done} images converties, ${skippedAlready} déjà faites.`);
console.log(`Total: ${(totalBefore/1024/1024).toFixed(2)} Mo -> ${(totalAfter/1024/1024).toFixed(2)} Mo`);
