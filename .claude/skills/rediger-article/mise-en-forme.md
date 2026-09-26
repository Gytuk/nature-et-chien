# Mise en forme nature-et-chien.fr

Les articles sont des fichiers `.md` avec du HTML brut pour les composants. Toutes les classes existent dans `src/styles/global.css` (bloc `SYSTÈME ÉDITORIAL` : pas de fond coloré, pas d'emoji dans le contenu, un seul accent vert forêt, `border-left` réservé aux callouts et citations).

## Philosophie

- **Sobre par défaut** : des paragraphes courts qui s'enchaînent. Un long paragraphe à plusieurs idées se découpe (voire un `###`).
- **Forme spéciale rare et justifiée** : seulement si l'information a une nature qui s'y prête (grille ci-dessous). Test : si je remets le texte simple, le lecteur perd-il vraiment quelque chose (repérer un risque, un seuil, un chiffre) ? Si non, texte simple.
- Une information ne cumule pas deux formes spéciales.
- 80 % du trafic est mobile : pas de tableau à plus de 4 colonnes, textes de cartes courts, CTA visibles.

## Grille sémantique

| Nature du passage | Forme |
|---|---|
| Introduction d'un informatif | `<p class="nc-lede">…</p>` |
| Risque, danger, urgence vétérinaire, sanction | `<div class="callout callout--danger">…</div>` |
| Conseil pratique secondaire, « bon à savoir » | `<div class="callout">…</div>` |
| Chiffre clé isolé (seuil, quantité, durée) | `<span class="stat-highlight">25 °C</span>` dans la phrase, jamais sur un chiffre banal |
| Un chiffre repère qui résume une section | `nc-stat` |
| Signaux gradués à surveiller (fatigue, chaleur, froid) | `nc-signals` |
| Conduite à tenir, gestes à faire | `nc-verdict` |
| Gradation, seuils, cas multiples, comparaison | tableau markdown, ou `nc-age-table` si 3 colonnes avec niveau |
| Étapes dans l'ordre | liste numérotée |
| Critères, symptômes, exemples sans ordre | liste à puces |
| Source officielle que le lecteur voudra consulter (loi, carte des parcs) | `> **Source officielle :** [nom](url)`, sans emoji |
| FAQ de fin | `nc-faq-accordion`, toujours |

## Modèles HTML

**Callout**
```html
<div class="callout callout--danger">
Texte de la mise en garde.
</div>
```

**Chiffre repère**
```html
<div class="nc-stat">
  <span class="nc-stat__num">4 à 6 semaines</span>
  <span class="nc-stat__label">c'est la préparation minimale recommandée avant…</span>
</div>
```

**Signaux** (`--watch` à surveiller, `--urgent` agir vite, `--stop` urgence)
```html
<ul class="nc-signals">
  <li class="nc-signal nc-signal--watch">
    <span class="nc-signal__tag">Agir sans attendre</span>
    <strong>Signal observé</strong>
    <span class="nc-signal__detail">Ce qu'il faut faire.</span>
  </li>
</ul>
```

**Conduite à tenir**
```html
<div class="nc-verdict">
  <span class="nc-verdict__label">Les gestes à faire</span>
  <ul>
    <li>…</li>
  </ul>
</div>
```

**Tableau à niveaux** : voir `src/content/sante/signes-fatigue-chien-randonnee.md` (`nc-age-table-wrap` > `table.nc-age-table`).

**FAQ** (la première question porte `open`)
```html
## FAQ

<div class="nc-faq-accordion">

  <details open>
    <summary>Question ?<span class="faq-chevron"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></span></summary>
    <div class="faq-answer"><p>Réponse.</p></div>
  </details>

</div>
```

## CTA vers un autre article

- Vers un **informatif** : toujours un simple lien markdown dans la phrase, jamais une carte.
- Vers un **comparatif** depuis un informatif, 1 lien : carte large
```html
<a href="/equipement/<slug>" class="inline-cta-card inline-cta-card--wide">
  <img src="/images/…/cover.webp" alt="…" loading="lazy">
  <div class="inline-cta-text">
    <div class="inline-cta-title">Titre de l'article ciblé</div>
    <div class="inline-cta-desc">Une phrase courte.</div>
    <span class="inline-cta-btn">Consulter le comparatif →</span>
  </div>
</a>
```
- 2 comparatifs ensemble : grille
```html
<div class="cta-grid">
  <a href="/equipement/<slug>" class="cta-card cta-card-preview">
    <div class="cta-img-preview"><img src="/images/…/cover.webp" alt="…" loading="lazy"></div>
    <div class="cta-card-text"><strong>Titre court</strong><span>Consulter notre comparatif →</span></div>
  </a>
</div>
```
- La carte vient **en plus** d'une phrase qui amène le lien, jamais seule. Image : la `image` du frontmatter de l'article ciblé.

## Composants comparatif

Copier la structure exacte de `src/content/equipement/meilleur-manteau-pour-chien.md` :
- bandeau : `<p class="affiliate-notice">Certains liens de cet article pointent vers des pages produit. Si vous achetez via ces liens, nous percevons une petite commission, sans surcoût pour vous.</p>`
- grille : `cmp-grid` (+ `cmp-grid--2` pour 4 produits) > `cmp-card` (badge, thumb, body avec name, pitch, specs, price, footer avec `cmp-card__cta` et `cmp-card__detail`) ; `cmp-card__cta--hardloop` pour Hardloop ; `cmp-card__cta-group` si deux formats à prix différents ;
- fiche : `## <a href="…" class="prc-heading-link" target="_blank" rel="nofollow sponsored">Nom : bénéfice</a>` puis `div.prc` (top, pros-cons, footer) ; `prc__btn--hardloop` pour Hardloop.

## Ancres

Le lien « Voir la fiche détaillée » pointe vers l'id généré par Astro à partir du texte du H2 : minuscules, accents conservés, ponctuation supprimée, chaque espace devient un tiret. « Kurgo Loft : le manteau » donne `#kurgo-loft--le-manteau`. `npm run check` vérifie chaque ancre.

## Interdits

- Aucun `<style>` dans un article, aucune classe Tailwind improvisée. Si une forme manque vraiment, ajouter la classe une fois dans `global.css` et le signaler à Tom (nom de la classe et raison).
- Pas d'emoji hors boutons d'achat, pas de fond coloré.
