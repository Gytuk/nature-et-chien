---
name: mise-en-forme-article
description: Met en forme un article nature-et-chien.fr rédigé en texte brut (.md) en comprenant le sens du texte pour choisir la forme qui le sert le mieux, sans jamais modifier le fond. À utiliser quand Tom fournit un nouvel article à publier (informationnel ou comparateur) et demande de le mettre en forme / publier / formatter.
---

# Mise en forme d'un article nature-et-chien.fr

## Philosophie

Ce skill n'est pas une checklist de composants à recopier. C'est un lecteur qui comprend le sens du texte et choisit la forme qui le sert, article par article. Il ne s'agit pas de plaquer les mêmes blocs partout, mais de repérer *pourquoi* un passage mériterait une mise en forme spéciale, et de ne l'appliquer que si ça sert réellement le sens.

**Style par défaut : sobre.** Du texte qui s'enchaîne, en paragraphes simples. Un long paragraphe qui traite de plusieurs idées se découpe en sous-paragraphes (voire un `###`), un paragraphe court et focalisé reste tel quel. Pas de gras à outrance, pas de bloc pour un bloc.

**Mise en forme spéciale : rare et justifiée.** Un encadré, une couleur, un tableau ne se justifient que si l'info a une nature qui s'y prête (voir grille ci-dessous). Si tu hésites, ne mets pas de forme spéciale : le texte simple reste le choix par défaut.

**Le fond ne bouge jamais.** Aucune phrase, aucune information n'est ajoutée, supprimée ou reformulée. Seule la forme change.

## Étape 0 : lire l'existant

Avant de formatter, grep les classes citées plus bas dans `nature-et-chien/src/styles/global.css` pour connaître leur rendu exact (couleurs, structure), et cherche le bloc `SYSTÈME ÉDITORIAL` dans ce même fichier : il pose déjà des règles fortes à respecter :
- pas de fond coloré, la couleur est réservée aux accents et aux alertes
- pas d'émojis dans le corps du texte
- `border-left` réservé aux callouts et blockquotes
- un seul accent (vert forêt), les alertes ont leur propre couleur

## Étape 1 : identifier le type d'article

- **Informationnel / guide** (`isAffiliate: false`) → `avant-de-partir`, `sante`, ou guide `equipement` non comparatif
- **Comparateur** (`isAffiliate: true`) → `equipement`, sélection de produits affiliés

## Étape 2 : frontmatter

Reprendre exactement les champs déjà utilisés selon le type (ne pas en inventer) :

**Informationnel :** `title, description, publishDate, category, tags, isAffiliate: false, featured, image, imageAlt, metaTitle, metaDescription` (+ `updatedDate` si mise à jour)

**Comparateur :** `title, description, publishDate, updatedDate, category, tags, isAffiliate: true, itemList, featured, theme, focusKeyword, image, imageAlt, metaTitle, metaDescription`

Si des champs manquent (metaTitle, imageAlt...), les proposer à partir de title/description existants, sans inventer de fond.

## Étape 3 : la grille de lecture sémantique

Pour chaque passage du texte, pose-toi la question : *quelle est la nature de cette information ?* Puis applique la forme correspondante. En dehors de ces cas, texte simple.

| Nature du passage repéré dans le texte | Forme à appliquer |
|---|---|
| Risque, danger, mise en garde importante (santé, sécurité, urgence vétérinaire, sanction) | `.callout.callout--danger` |
| Conseil pratique ou "bon à savoir" secondaire, pas critique | `.callout` (variante par défaut) |
| Chiffre clé isolé qui mérite d'être repéré au survol (quantité, seuil, prix, durée) | entourer la valeur d'un `<span class="stat-highlight">` dans la phrase, jamais un chiffre banal |
| Gradation / échelle / seuils progressifs (température → risque, poids → dose, âge → recommandation) | tableau markdown `\| col \| col \|` |
| Comparaison de plusieurs éléments avec plusieurs critères | tableau markdown |
| Suite d'étapes à suivre dans l'ordre | liste numérotée |
| Liste de critères, symptômes, exemples sans ordre imposé | liste à puces |
| Citation ou donnée issue d'une source externe (loi, étude, site officiel) | `> 📎 **Libellé :** [texte](url)` |
| Lien vers un autre article du site | voir CTA interne ci-dessous |
| FAQ de fin d'article | `nc-faq-accordion` (toujours présent) |

Une même information ne cumule pas deux formes spéciales (ex : pas de chiffre en `.stat-highlight` *dans* un `.callout--danger` répétant la même chose). Choisis la forme la plus adaptée, une seule fois.

**Test avant d'appliquer une forme spéciale :** si tu retires la classe/le bloc et remets le texte simple, est-ce que le lecteur perd vraiment quelque chose (repérage rapide d'un risque, d'un seuil, d'un chiffre) ? Si non, ne mets pas de forme spéciale.

### Exemples concrets
- "Au-delà de 25°C, raccourcissez les pauses" → seuil de gradation, candidat à un tableau si plusieurs seuils apparaissent dans le texte ; sinon `.stat-highlight` sur "25°C" suffit
- "En cas de doute sur un coup de chaleur, contactez un vétérinaire sans attendre" → `.callout--danger`
- "Rincez la gourde après chaque sortie" → texte simple, aucune forme
- "50 à 80 ml par kg par jour, jusqu'au double en été" → `.stat-highlight` sur les valeurs, éventuellement un tableau si plusieurs gabarits sont détaillés (cas hydratation)

## Étape 4 : CTA interne (lien vers un autre article du site)

Un seul format selon le nombre de liens groupés, jamais de lien stylé à la main ni de classes Tailwind ad-hoc :

- **1 seul lien isolé** → `inline-cta-card inline-cta-card--wide`
- **2 liens ensemble** → `cta-grid` + `cta-card-preview` (format carré, image en aperçu)

```html
<!-- 1 lien -->
<a href="/chemin/article" class="inline-cta-card inline-cta-card--wide">
  <img src="/images/.../cover.webp" alt="..." loading="lazy">
  <div class="inline-cta-text">
    <div class="inline-cta-title">Titre de l'article ciblé</div>
    <div class="inline-cta-desc">Description courte, 1 phrase.</div>
    <span class="inline-cta-btn">Consulter →</span>
  </div>
</a>

<!-- 2 liens -->
<div class="cta-grid">
  <a href="/chemin/article-1" class="cta-card cta-card-preview">
    <div class="cta-img-preview"><img src="..." alt="..." loading="lazy"></div>
    <div class="cta-card-text"><strong>Titre court</strong><span>Consulter →</span></div>
  </a>
  <a href="/chemin/article-2" class="cta-card cta-card-preview">...</a>
</div>
```

Intro optionnelle au-dessus : `<p class="inline-cta-intro">texte</p>`.

## Étape 5 : composants spécifiques comparateur

- Bandeau affilié après l'intro : `<p class="affiliate-notice">Certains liens de cet article pointent vers des pages produit. Si vous achetez via ces liens, nous percevons une petite commission, sans surcoût pour vous.</p>`
- Grille de sélection : `cmp-grid` > `cmp-card` (badge `cmp-card__badge`, `cmp-card--featured` pour le choix mis en avant)
- Fiches produit détaillées : `prc` (`.prc__top`, `.prc__pros-cons`, `.prc__footer`), précédées de `## <a href="..." class="prc-heading-link">Nom produit : accroche</a>`

## Étape 6 : jamais de CSS inline

Si une forme spéciale n'a pas d'équivalent dans `global.css`, ajoute la classe une seule fois dans `global.css` (jamais un `<style>` dans le `.md`) et signale-le à Tom en une ligne, avec le nom de la classe créée et pourquoi.

## Étape 7 : vérification finale

- Chaque forme spéciale utilisée a une vraie justification sémantique (relis la grille de l'étape 3) — sinon repasse en texte simple
- Aucun `<style>` inline, aucune classe Tailwind ad-hoc
- Un seul format de CTA par usage
- FAQ présente
- Frontmatter cohérent avec le type d'article
- Relecture : aucun mot du fond n'a été changé, ajouté ou coupé

Livrer le fichier `.md` complet, prêt à être déposé dans `src/content/<category>/`.
