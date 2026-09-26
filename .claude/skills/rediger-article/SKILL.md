---
name: rediger-article
description: Workflow complet de production d'un article nature-et-chien.fr dans Claude Code, du cadrage mot-clé à l'article mis en page et contrôlé, pour les deux types d'articles (informatif et comparatif affilié). À utiliser dès que Tom veut écrire, préparer, cadrer ou brainstormer un article, sélectionner des produits pour un comparatif, ou mettre en forme un texte déjà rédigé. Remplace les skills Claude Chat keyword-brainstorming, article-prompt-nec, seo-editorial, product-selection-description et l'ancien mise-en-forme-article.
---

# Rédiger un article nature-et-chien.fr

Objectif : un article simple, optimisé SEO, au ton amical, qui aide vraiment le lecteur à trouver sa réponse, avec des infos fiables (scientifiques quand c'est possible, sinon consensus de professionnels et de pratiquants). L'article sort **directement au format final** dans `src/content/`, mis en page, maillé, contrôlé.

## Fichiers de référence (à lire avant d'agir)

| Fichier | Contenu | Quand le lire |
|---|---|---|
| [regles-editoriales.md](regles-editoriales.md) | Lecteur, ton, style, interdits, sourcing, liens, doctrine du site | Toujours, avant la recherche et avant la rédaction |
| [seo.md](seo.md) | Cadrage mot-clé, cannibalisation, H1/H2, snippet, FAQ, metas, frontmatter, EEAT | Toujours, au cadrage et avant la rédaction |
| [comparatif.md](comparatif.md) | Sélection produits, sources produit, structure et composants du comparatif | Uniquement pour un comparatif |
| [mise-en-forme.md](mise-en-forme.md) | Grille sémantique et composants HTML du site | Avant la rédaction |
| [briefs.md](briefs.md) | Modèles des fichiers de travail (cadrage, recherche, produits) | Au moment de créer chaque fichier |

Lire aussi `MAILLAGE.md` (racine du projet, régénéré automatiquement à chaque commit d'article) : seule source des URLs internes.

## Dossier de travail

Chaque article a son dossier `_briefs/<slug>/`. Chaque étape écrit son fichier, l'étape suivante le relit. Si la session est coupée, on reprend à partir des fichiers.

```
_briefs/<slug>/
├── cadrage.md       étape 1
├── recherche.md     étape 2 (informatif) ou recherche usage (comparatif)
├── produits.md      comparatif uniquement
└── amazon-<produit>.txt   extraits de pages Amazon copiés par Tom
```

## Workflow informatif

1. **Cadrage** (1 à 2 validations). Tom donne le sujet et ses données Semrush (captures ou chiffres). Je vérifie la cannibalisation dans `MAILLAGE.md`, j'analyse la SERP et les PAA (WebSearch), puis je propose d'un bloc : focus keyword, intention, angle différenciant, champ sémantique, pistes de FAQ, snippet visé, liens internes candidats. Je challenge l'angle, je ne valide pas d'office. Si une donnée manque (volume, KD), je dis précisément quoi vérifier sur Semrush. → `cadrage.md`. **Validation de Tom.**
2. **Recherche**. Balayage large d'abord (SERP, PAA, forums, groupes de pratiquants), puis recherche par sous-question selon la hiérarchie de sources de `regles-editoriales.md`. Chaque lien externe candidat est ouvert (WebFetch) pour vérifier qu'il répond. → `recherche.md`.
3. **Résumé + plan**. Dans le chat : 5 à 8 lignes sur ce que la recherche a trouvé (dont les zones d'incertitude et les points de consensus terrain utiles au lecteur), puis le plan : H1, H2 en questions, FAQ, place du CTA, liens internes et externes, snippet visé. **Validation de Tom.**
4. **Rédaction au format final** dans `src/content/<categorie>/<slug>.md`, en appliquant les 4 fichiers de référence d'un coup (fond, SEO, mise en forme, maillage).
5. **Contrôle** : `npm run check -- src/content/<categorie>/<slug>.md`. Corriger toutes les erreurs, examiner chaque avertissement. Puis relecture avec la checklist finale de `seo.md`.
6. **Aperçu** : lancer `npm run dev` en arrière-plan (seulement dans ce workflow, c'est validé par Tom), vérifier que la page répond, donner le lien `http://localhost:4321/<prefixe>/<slug>/`. Tom relit, je corrige.
7. **Commit local** quand Tom valide (le hook régénère `MAILLAGE.md`). **Jamais de push sans confirmation explicite juste avant.** Puis proposer le maillage rétroactif (voir `seo.md`).

## Workflow comparatif

1. **Cadrage + critères**. Comme l'informatif, plus : profil exact de l'acheteur, critères non négociables, critères différenciants, produits contre-indiqués, contrôle de redondance avec les autres comparateurs. → `cadrage.md`. **Validation de Tom.**
2. **Sélection produits** selon `comparatif.md` : shortlist construite depuis le besoin (tests, forums, fabricants), puis seulement ensuite vérification Hardloop (WebFetch). Tom vérifie les stocks, colle les extraits Amazon utiles dans `_briefs/<slug>/amazon-<produit>.txt` et fournit les liens affiliés. → `produits.md` avec chaque donnée taguée. **Validation de Tom.**
3. **Recherche usage** courte : qui a besoin du produit, critères de choix, erreurs fréquentes, questions des acheteurs. Même hiérarchie de sources. → `recherche.md`. Elle nourrit l'intro et la partie SEO placée après les fiches produit.
4. **Résumé + plan** (structure imposée par `comparatif.md`). **Validation de Tom.**
5. à 7. Identiques à l'informatif : rédaction au format final, contrôle, aperçu, commit.

## Mode « mettre en forme un texte existant »

Si Tom fournit un texte déjà rédigé ailleurs : ne pas toucher au fond (aucune phrase ajoutée, supprimée ou reformulée), appliquer uniquement `mise-en-forme.md` et le frontmatter de `seo.md`, puis le contrôle. Signaler les écarts aux règles sans les corriger d'office.

## Règles de conduite

- Une étape à la fois aux points de validation : ne pas enchaîner cadrage, recherche et rédaction sans l'accord de Tom.
- Lire les fichiers en entier avant de proposer (MAILLAGE.md compris : entrées pas toujours uniformes).
- Signaler explicitement tout conflit entre une consigne de Tom et une règle des fichiers de référence, ne pas trancher en silence.
- Révisions : quand elles sont nombreuses, réécrire la section entière plutôt que de multiplier les petits patchs. Pour un simple changement de titre de FAQ, montrer seulement l'avant et l'après.
- Tom n'est pas développeur : expliquer simplement toute action technique (commit, script, serveur local).
- Quand Tom corrige une règle pendant un article, proposer de l'inscrire dans le fichier de référence concerné, pour qu'elle ne soit pas perdue.
