import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const CATEGORY_DIRS = {
  "avant-de-partir": "avant-de-partir",
  sante: "sante",
  equipement: "equipement",
};

const CATEGORY_URL_PREFIX = {
  "avant-de-partir": "avant-de-partir",
  sante: "sante-bien-etre",
  equipement: "equipement",
};

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const titleMatch = line.match(/^title:\s*"(.*)"\s*$/) || line.match(/^title:\s*(.+)\s*$/);
    if (titleMatch) data.title = titleMatch[1];
    const categoryMatch = line.match(/^category:\s*(\S+)\s*$/);
    if (categoryMatch) data.category = categoryMatch[1];
    const affiliateMatch = line.match(/^isAffiliate:\s*(true|false)\s*$/);
    if (affiliateMatch) data.isAffiliate = affiliateMatch[1] === "true";
    const dateMatch = line.match(/^publishDate:\s*(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) data.publishDate = dateMatch[1];
  }
  return data;
}

function collectArticles(dir) {
  const folder = join(ROOT, "src/content", dir);
  return readdirSync(folder)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = readFileSync(join(folder, file), "utf-8").replace(/^﻿/, "");
      const data = parseFrontmatter(raw);
      if (!data || !data.title || !data.category) return null;
      const prefix = CATEGORY_URL_PREFIX[data.category];
      return {
        title: data.title,
        url: `/${prefix}/${slug}/`,
        isAffiliate: !!data.isAffiliate,
        publishDate: data.publishDate ?? "0000-00-00",
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.publishDate.localeCompare(b.publishDate));
}

function table(articles, type) {
  return articles
    .map((a) => `| ${a.title} | ${a.url} | ${type} |`)
    .join("\n");
}

const avantDePartir = collectArticles(CATEGORY_DIRS["avant-de-partir"]);
const sante = collectArticles(CATEGORY_DIRS.sante);
const equipement = collectArticles(CATEGORY_DIRS.equipement);
const equipementGuides = equipement.filter((a) => !a.isAffiliate);
const equipementComparateurs = equipement.filter((a) => a.isAffiliate);

const today = new Date().toISOString().slice(0, 10);

const content = `# Maillage interne — nature-et-chien.fr

> Référence de tous les articles publiés, à consulter avant de rédiger pour placer des liens internes pertinents.
> Généré automatiquement par scripts/generate-maillage.mjs à chaque commit touchant un article.
> Dernière mise à jour : ${today}

---

## Règles de maillage

Règles complètes : .claude/skills/rediger-article/regles-editoriales.md (section Liens internes).

- 1 à 4 liens internes selon la pertinence réelle, sans minimum forcé, ancres descriptives dans le corps du texte
- Informatif : le lien vers un comparateur arrive au 2e ou 3e H2, une fois la réponse principale posée
- Comparatif : aucun lien vers un informatif dans l'introduction
- Utiliser uniquement les URLs de ce fichier

---

## Avant de partir

Articles informationnels sur la préparation, la législation et les premières sorties.

| Titre | URL | Type |
|-------|-----|------|
${table(avantDePartir, "Informationnel")}

---

## Santé & bien-être

Articles informationnels sur la santé, la sécurité et le bien-être du chien en randonnée.

| Titre | URL | Type |
|-------|-----|------|
${table(sante, "Informationnel")}

---

## Équipement — Guides (informationnels)

Articles de fond sur le choix de l'équipement, sans liens affiliés directs.

| Titre | URL | Type |
|-------|-----|------|
${table(equipementGuides, "Informationnel")}

---

## Équipement — Comparateurs (affiliés)

Articles comparatifs avec liens affiliés. Cibles de conversion prioritaires.

| Titre | URL | Type |
|-------|-----|------|
${table(equipementComparateurs, "Comparateur affilié")}
`;

writeFileSync(join(ROOT, "MAILLAGE.md"), content, "utf-8");
console.log("MAILLAGE.md régénéré.");
