# nature-et-chien.fr

Site SEO affilié sur la randonnée avec son chien en France. Niche : préparation, santé, législation, équipement.

**Stack :** Astro v6 + Tailwind v4. Contenu en markdown dans `src/content/`.

---

## Commandes

Toutes les commandes se lancent depuis la racine du projet (`nature-et-chien/`) :

| Commande | Action |
|----------|--------|
| `npm install` | Installe les dépendances |
| `npm run dev` | Serveur local sur `localhost:4321` |
| `npm run build` | Build de production dans `./dist/` |
| `npm run preview` | Prévisualise le build en local |

---

## Structure

```
src/
├── components/    → ArticleCard, Breadcrumb, Footer, Header, ProductCard,
│                    RelatedArticles, SEO, TableOfContents
├── layouts/       → BaseLayout.astro, ArticleLayout.astro
├── pages/         → index, a-propos, mentions-legales, politique-confidentialite
│                    /avant-de-partir/  /equipement/  /sante-bien-etre/
├── content/       → avant-de-partir/  equipement/  sante/  (fichiers .md)
├── styles/        → global.css
└── content.config.ts
public/            → images, favicon, robots.txt
```

---

## Déploiement

Déploiement actuel : build manuel copié sur Hostinger.

Migration prévue : VS Code + Git + GitHub + Netlify (déploiement automatique sur push).

---

## Affiliation

- **Hardloop** : prioritaire, meilleures commissions
- **Amazon Associates France** : secondaire

Produits prioritaires : harnais de randonnée (50-85 €, meilleur panier moyen).
