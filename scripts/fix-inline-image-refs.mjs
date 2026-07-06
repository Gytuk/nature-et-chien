import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const contentDir = path.join(root, "src/content");
const publicDir = path.join(root, "public");
const backupDir = path.join(root, "public-images-originals");

function walk(dir, exts) {
  let out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(full, exts));
    else if (exts.some(e => entry.name.toLowerCase().endsWith(e))) out.push(full);
  }
  return out;
}

// Construit la table de correspondance ancien chemin -> nouveau chemin (.webp)
// à partir des originaux sauvegardés dans public-images-originals/
const backedUp = walk(backupDir, [".jpg", ".jpeg", ".png"]);

const renameMap = new Map(); // "/images/xxx.jpg" -> "/images/xxx.webp"

for (const f of backedUp) {
  const relFromBackup = path.relative(backupDir, f); // images/equipement/gourde/cover.jpg
  const parsed = path.parse(relFromBackup);
  const webpRel = path.join(parsed.dir, parsed.name + ".webp");
  const webpAbs = path.join(publicDir, webpRel);
  if (!existsSync(webpAbs)) continue; // pas converti (ex: fichier manquant)

  const oldDecoded = "/" + relFromBackup.split(path.sep).join("/");
  const newDecoded = "/" + webpRel.split(path.sep).join("/");
  const oldEncoded = oldDecoded.split("/").map(encodeURIComponent).join("/");
  const newEncoded = newDecoded.split("/").map(encodeURIComponent).join("/");

  renameMap.set(oldEncoded, newEncoded);
  if (oldDecoded !== oldEncoded) renameMap.set(oldDecoded, newEncoded);
}

console.log(`${renameMap.size} correspondances de chemins à appliquer.\n`);

const mdFiles = walk(contentDir, [".md"]);
let totalReplacements = 0;
let filesChanged = 0;

for (const md of mdFiles) {
  let text = readFileSync(md, "utf8");
  let fileChanged = false;
  for (const [oldPath, newPath] of renameMap) {
    if (text.includes(oldPath)) {
      const count = text.split(oldPath).length - 1;
      text = text.split(oldPath).join(newPath);
      totalReplacements += count;
      fileChanged = true;
    }
  }
  if (fileChanged) {
    writeFileSync(md, text);
    filesChanged++;
    console.log(`Mis à jour: ${path.relative(root, md)}`);
  }
}

console.log(`\n${totalReplacements} remplacements dans ${filesChanged} fichiers.`);
