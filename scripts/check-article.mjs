// Contrôle d'un article avant publication.
// Usage : npm run check -- src/content/<categorie>/<slug>.md   (sans argument : tous les articles, résumé)
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const CONTENT = join(ROOT, "src/content");
const URL_PREFIX = { "avant-de-partir": "avant-de-partir", sante: "sante-bien-etre", equipement: "equipement" };
const STATIC_PAGES = ["/", "/a-propos", "/mentions-legales", "/politique-confidentialite", "/avant-de-partir", "/sante-bien-etre", "/equipement"];
const AFFILIATE = /(amzn\.to|amazon\.|link\.amazon|tidd\.ly|hardloop\.)/i;
const OWN_DOMAIN = /nature-et-chien\.fr/i;
const BANNED = ["il convient de noter", "n'hésitez pas", "en conclusion", "dans cet article nous allons", "dans cet article, nous allons", "cliquez ici", "aucune étude ne permet d'affirmer"];
const PLACEHOLDER = /\bTODO\b|\bXXX\b|à compléter|lien affilié à (insérer|créer)|\bA_COMPLETER\b|\[URL\]|\[lien\]/i;
const EMOJI = /\p{Extended_Pictographic}/u;
const STATIC_BRANDS = ["Hardloop", "Amazon"];

// ---------- lecture ----------
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: null, body: raw };
  const data = {};
  let listKey = null;
  for (const line of m[1].split(/\r?\n/)) {
    const item = line.match(/^\s+-\s*(.*)$/);
    if (item && listKey) { data[listKey].push(unquote(item[1])); continue; }
    const kv = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, value] = kv;
    if (value === "") { data[key] = []; listKey = key; continue; }
    listKey = null;
    data[key] = value.startsWith("[") ? value.slice(1, -1).split(",").map((s) => unquote(s.trim())).filter(Boolean) : unquote(value.replace(/\s+#.*$/, ""));
  }
  return { data, body: raw.slice(m[0].length) };
}
const unquote = (s) => s.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");

function allArticles() {
  const list = [];
  for (const dir of Object.keys(URL_PREFIX)) {
    for (const f of readdirSync(join(CONTENT, dir)).filter((f) => f.endsWith(".md"))) {
      const path = join(CONTENT, dir, f);
      const { data } = parseFrontmatter(readFileSync(path, "utf-8").replace(/^﻿/, ""));
      list.push({ path, dir, slug: f.replace(/\.md$/, ""), data: data ?? {} });
    }
  }
  return list;
}

// ---------- outils texte ----------
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, "'");
const plain = (s) => s.replace(/<[^>]+>/g, " ").replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_#>`|]/g, " ").replace(/\s+/g, " ").trim();
function slugify(text) {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/ /g, "-");
}
const cleanPath = (u) => { const p = u.split("#")[0].split("?")[0].replace(/\/+$/, ""); return p === "" ? "/" : p; };

// ---------- contrôle d'un article ----------
function check(article, index) {
  const raw = readFileSync(article.path, "utf-8").replace(/^﻿/, "");
  const { data, body } = parseFrontmatter(raw);
  const errors = [], warnings = [], infos = [];
  if (!data) return { errors: ["Frontmatter introuvable"], warnings, infos };
  const isAff = data.isAffiliate === "true";

  // Frontmatter
  const required = ["title", "description", "publishDate", "category", "isAffiliate", "focusKeyword", "image", "imageAlt", "metaTitle", "metaDescription"];
  if (isAff) required.push("theme", "itemList");
  for (const k of required) if (data[k] === undefined || data[k] === "" || (Array.isArray(data[k]) && !data[k].length)) errors.push(`Champ manquant : ${k}`);
  if (data.category && data.category !== article.dir) errors.push(`category "${data.category}" ne correspond pas au dossier ${article.dir}`);

  if (data.metaTitle) {
    const len = data.metaTitle.length;
    if (len > 60) warnings.push(`metaTitle ${len} car. (max 60, Google coupe au-delà)`);
    else if (len < 40) warnings.push(`metaTitle court : ${len} car. (viser 50 à 60)`);
  }
  if (data.metaDescription) {
    const len = data.metaDescription.length;
    if (len < 145 || len > 160) warnings.push(`metaDescription ${len} car. (viser 145 à 160)`);
    if (/^(oui|non)\b/i.test(data.metaDescription)) warnings.push("metaDescription commence par une réponse directe (Oui/Non) : préférer une accroche orientée clic");
  }
  if (data.description && data.description.length > 170) warnings.push(`description ${data.description.length} car. (viser 1 à 2 phrases, 160 max)`);

  const fk = data.focusKeyword ? norm(data.focusKeyword) : null;
  if (fk && data.title && !norm(data.title).includes(fk)) warnings.push(`Le title (H1) ne contient pas le focusKeyword "${data.focusKeyword}"`);
  if (fk && !norm(plain(body).slice(0, 450)).includes(fk)) warnings.push("focusKeyword absent du début de l'introduction (deux premières phrases)");

  if (data.image) {
    const img = join(ROOT, "public", decodeURIComponent(data.image));
    if (!existsSync(img)) warnings.push(`Image de couverture introuvable : public${decodeURIComponent(data.image)} (à déposer par Tom)`);
  }

  // Ponctuation, emojis, style
  const lines = body.split(/\r?\n/);
  const fmText = [data.title, data.description, data.metaTitle, data.metaDescription, data.imageAlt].filter(Boolean).join(" ");
  if (fmText.includes("—")) errors.push("Tiret long (—) dans le frontmatter");
  const enDashLines = [];
  lines.forEach((line, i) => {
    const n = i + 1 + raw.slice(0, raw.length - body.length).split(/\r?\n/).length - 1;
    if (line.includes("—")) errors.push(`Tiret long (—) ligne ${n}`);
    const en = line.match(/.–./g);
    if (en) for (const m of en) /\d–\d/.test(m) ? enDashLines.push(n) : errors.push(`Demi-cadratin (–) en ponctuation ligne ${n}`);
    if (EMOJI.test(line) && !/cmp-card__cta|cmp-card__badge/.test(line)) errors.push(`Emoji ligne ${n}`);
    if (/<style/i.test(line)) errors.push(`Bloc <style> ligne ${n} : utiliser global.css`);
    if (PLACEHOLDER.test(line)) errors.push(`Placeholder ligne ${n} : ${line.trim().slice(0, 70)}`);
    if (/<!--\s*CTA/i.test(line)) warnings.push(`CTA en attente ligne ${n} (comparateur pas encore publié)`);
    const low = line.toLowerCase().replace(/’/g, "'");
    for (const b of BANNED) if (low.includes(b)) errors.push(`Formule interdite « ${b} » ligne ${n}`);
  });
  if (enDashLines.length) warnings.push(`Demi-cadratin (–) entre chiffres, lignes ${[...new Set(enDashLines)].join(", ")} : écrire « 1 à 2 »`);
  const tutoie = plain(body.replace(/<style[\s\S]*?<\/style>/gi, "")).match(/(?<!\p{L})(tu|ton|ta|tes|toi)\s/giu);
  if (tutoie) warnings.push(`Tutoiement possible (${[...new Set(tutoie.map((t) => t.trim().toLowerCase()))].join(", ")}) : vérifier`);

  // Titres et ancres
  const ids = new Map();
  const headings = [];
  for (const line of lines) {
    const h = line.match(/^(#{2,6})\s+(.*)$/);
    if (!h) continue;
    const text = plain(h[2]);
    let id = slugify(text);
    const count = ids.get(id) ?? 0;
    ids.set(id, count + 1);
    if (count) id = `${id}-${count}`;
    ids.set(id, ids.get(id) ?? 1);
    headings.push({ level: h[1].length, text, id });
  }
  const idSet = new Set(headings.map((h) => h.id));
  const h2 = headings.filter((h) => h.level === 2 && h.text.toLowerCase() !== "faq");
  const notQuestion = h2.filter((h) => !isAff && !h.text.trim().endsWith("?"));
  if (notQuestion.length) warnings.push(`H2 sans question : ${notQuestion.map((h) => `« ${h.text} »`).join(", ")}`);

  // Liens
  const hrefs = [...body.matchAll(/href="([^"]+)"/g)].map((m) => ({ url: m[1], tag: tagAround(body, m.index) }));
  const mdLinks = [...body.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)\)/g)].map((m) => ({ url: m[1], tag: null }));
  const links = [...hrefs, ...mdLinks];
  const internal = new Set();
  let external = 0;
  for (const { url, tag } of links) {
    if (url.startsWith("#")) {
      if (!idSet.has(decodeURIComponent(url.slice(1)))) errors.push(`Ancre introuvable : ${url}`);
    } else if (url.startsWith("/")) {
      if (url.startsWith("/images/")) continue;
      const p = cleanPath(url);
      if (!index.has(p) && !STATIC_PAGES.includes(p)) errors.push(`Lien interne cassé : ${url}`);
      else if (!STATIC_PAGES.includes(p)) internal.add(p);
    } else if (/^https?:/.test(url)) {
      if (AFFILIATE.test(url)) {
        if (tag === null) errors.push(`Lien affilié en markdown (sans rel="nofollow sponsored") : ${url}`);
        else if (!/rel="[^"]*sponsored/.test(tag)) errors.push(`Lien affilié sans rel="nofollow sponsored" : ${url}`);
        if (!isAff) warnings.push(`Lien affilié dans un informatif : ${url}`);
      } else if (!OWN_DOMAIN.test(url)) external++;
    }
  }
  const selfPath = `/${URL_PREFIX[article.dir]}/${article.slug}`;
  internal.delete(selfPath);
  if (internal.size < 1 || internal.size > 4) warnings.push(`${internal.size} article(s) lié(s) en interne (viser 1 à 4)`);
  if (external > 2) warnings.push(`${external} liens externes (max 2)`);
  if (!isAff && external === 0) warnings.push("Aucun lien externe (viser 1 à 2 sources fiables)");

  // FAQ
  if (!body.includes("nc-faq-accordion")) errors.push("FAQ absente (nc-faq-accordion)");
  else {
    const q = (body.match(/<details/g) || []).length;
    if (q < 5 || q > 6) warnings.push(`FAQ : ${q} questions (viser 5 à 6)`);
  }

  // Marques dans un informatif
  if (!isAff) {
    const found = [...index.brands].filter((b) => new RegExp(`\\b${b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(plain(body)));
    if (found.length) warnings.push(`Marque(s) citée(s) dans un informatif : ${found.join(", ")}`);
  }

  // Comparatif
  if (isAff) {
    if (!body.includes("affiliate-notice")) errors.push("Bandeau affilié absent (affiliate-notice)");
    const cards = (body.match(/class="cmp-card[ "]/g) || []).length;
    if (Array.isArray(data.itemList) && cards && cards !== data.itemList.length) warnings.push(`${cards} cartes pour ${data.itemList.length} produits dans itemList`);
    if (cards === 4 && !body.includes("cmp-grid--2")) warnings.push("4 produits : ajouter cmp-grid--2");
  }

  const words = plain(body).split(" ").length;
  infos.push(`${words} mots · ${h2.length} H2 · ${internal.size} lien(s) interne(s) · ${external} lien(s) externe(s)`);
  return { errors, warnings, infos };
}

function tagAround(text, pos) {
  const start = text.lastIndexOf("<", pos);
  const end = text.indexOf(">", pos);
  return text.slice(start, end + 1);
}

// ---------- exécution ----------
const articles = allArticles();
const index = new Set(articles.map((a) => `/${URL_PREFIX[a.dir]}/${a.slug}`));
index.brands = new Set(STATIC_BRANDS);
for (const a of articles) for (const item of a.data.itemList ?? []) {
  const brand = item.split(/\s+/)[0];
  if (brand && brand.length > 2 && /^[A-Z]/.test(brand)) index.brands.add(brand);
}

const args = process.argv.slice(2);
const targets = args.length
  ? args.map((p) => { const path = join(ROOT, p); const dir = relative(CONTENT, path).split(/[\\/]/)[0]; return { path, dir, slug: path.split(/[\\/]/).pop().replace(/\.md$/, "") }; })
  : articles;

let failed = 0;
for (const t of targets) {
  if (!existsSync(t.path)) { console.log(`✖ Fichier introuvable : ${t.path}`); failed++; continue; }
  const { errors, warnings, infos } = check(t, index);
  const name = relative(ROOT, t.path).replace(/\\/g, "/");
  if (args.length) {
    console.log(`\n${name}`);
    for (const e of errors) console.log(`  ✖ ${e}`);
    for (const w of warnings) console.log(`  ⚠ ${w}`);
    for (const i of infos) console.log(`  · ${i}`);
    if (!errors.length && !warnings.length) console.log("  ✔ Rien à signaler");
  } else {
    console.log(`${errors.length ? "✖" : warnings.length ? "⚠" : "✔"} ${name} : ${errors.length} erreur(s), ${warnings.length} avertissement(s)`);
  }
  if (errors.length) failed++;
}
process.exitCode = failed ? 1 : 0;
