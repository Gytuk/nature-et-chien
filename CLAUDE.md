# nature-et-chien

Blog SEO sur la randonnée avec chien. Astro v6 + Tailwind v4. Contenu en français.

## Stack
- `astro dev` — serveur local  
- `astro build` — production dans `dist/`
- Tailwind v4 : config via CSS (`@theme`), pas de `tailwind.config.js`

## Structure src/
```
components/    → ArticleCard, Breadcrumb, Footer, Header, ProductCard,
                 RelatedArticles, SEO, TableOfContents
layouts/       → BaseLayout.astro, ArticleLayout.astro
pages/         → index, a-propos, mentions-legales, politique-confidentialite
               → /avant-de-partir/  /equipement/  /sante-bien-etre/  (index + [...slug])
content/       → avant-de-partir/  equipement/  sante/  (fichiers .md)
styles/        → global.css
content.config.ts
```

## Règles de travail

**Périmètre strict** : faire uniquement ce qui est demandé. Pas de refactoring, nettoyage, ou amélioration non demandés.

**Pas d'actions automatiques** : ne jamais lancer `astro dev`, ouvrir un navigateur, ou faire une prévisualisation sauf si explicitement demandé.

**Pas de vérification post-modification** : ne pas relire les fichiers après les avoir édités pour "confirmer" — faire confiance aux outils.

**Une tâche = une action** : modifier le minimum de fichiers nécessaires. S'arrêter dès que c'est fait.

**Compréhension 95%** : si la demande est ambiguë, poser une question courte avant d'agir plutôt que d'interpréter.

**Jamais de `git push` sans confirmation explicite juste avant**, même après un accord donné plus tôt dans la session ou pour un changement mineur. Plan Netlify gratuit (300 min de build/mois) : chaque push déclenche un build. `git commit` local ne pose pas ce problème et ne nécessite pas de confirmation séparée.

## Contexte Jarvis

Ce projet fait partie du Workspace Jarvis de Tom. Les livrables produits pour ce site (audits, plans éditoriaux, analyses) vont dans `../livrables/sites-web/`.
