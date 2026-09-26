# Comparatif affilié nature-et-chien.fr

Règles propres aux comparatifs (`isAffiliate: true`, catégorie `equipement`). Modèle de référence : `src/content/equipement/meilleur-manteau-pour-chien.md`.

## 1. Sélection des produits

Règle fondamentale : **partir du besoin, pas du catalogue.** Jamais chercher ce qui est dispo sur Hardloop puis construire une justification.

**Étape 1, profil et critères** (dans `cadrage.md`, avant de regarder un produit)
- Profil exact : gabarit, activité, fréquence, contraintes.
- Critères non négociables (dont la doctrine du site : épaules libres, pas de sangle horizontale sur le poitrail).
- Critères différenciants qui justifient plusieurs produits (chaleur, protection, prix, usage…).
- Types de produits contre-indiqués.

**Étape 2, shortlist idéale indépendante de la source**
- Sources : tests indépendants, forums et communautés, recommandations de professionnels, fiches fabricant.
- 4 à 6 produits. Pour chacun : pourquoi il convient (argument technique), sa différence réelle, ses limites connues.
- Identifier exactement chaque produit : gamme, version, suffixe (Vert Jacket ≠ Vert Coverall, Overcoat Fuse Vest ≠ Jacket, IDC Power ≠ Longwalk). Un nom inconnu ou ambigu = lire la fiche avant d'aller plus loin.

**Étape 3, disponibilité**
- Hardloop : WebFetch sur la page produit (contenu en markdown, prévoir une réponse longue pour les tailles et le stock). Pour trouver l'URL : recherche web « <nom exact du produit> hardloop » (les pages catégories Hardloop se lisent mal).
- Amazon : illisible par WebFetch. Tom copie les passages utiles de la page dans `_briefs/<slug>/amazon-<produit>.txt` (titre, prix, tailles, caractéristiques, description). Lui dire précisément ce qui manque si besoin.
- Règles de stock : comparatif grand chien, tailles L et XL disponibles ; petit chien, XS et S ; polyvalent, au moins 3 tailles centrales. Sinon produit éliminé ou signalé avec réserve.
- Contraintes commerciales de Tom (exemple : au moins 2 produits Hardloop, une entrée de gamme Amazon) : les respecter sans sacrifier un critère non négociable. En cas de conflit, le dire.

**Étape 4, adapter honnêtement**
- Produit idéal indisponible : équivalent fonctionnel, autre source, ou comparatif réduit. Jamais de produit de remplissage.
- Si une sélection est remise en cause, repartir de l'étape 1 sans réutiliser l'ancienne sélection.

**Cohérence de la sélection**
- Chaque produit se distingue sur au moins un critère objectif (conception, usage, prix, profil). Pas de segmentation artificielle (exemple refusé : répartir des sacs par durée de sortie).
- La progression de prix correspond à une progression de fonction ou de qualité.
- Pas de produit déjà recommandé dans un autre comparatif, sauf usage clairement différent et justifié.

## 2. Fiabilité des données produit

Chaque donnée de `produits.md` porte un tag :
- **[Retailer]** : sur la page du lien affilié (Hardloop ou Amazon). Utilisable telle quelle.
- **[Fabricant]** : fiche ou visuel du fabricant. Utilisable avec « selon le fabricant » ou « annoncé par la marque ».
- **[Test]** : observation d'un test indépendant. Reformulée en constat d'usage (« en usage réel, … »), sans citer la source.
- **[Tiers]** : revendeur non affilié. Ne pas publier.

Jamais publiés : notes et nombres d'avis, allégations santé marketing (« favorise la circulation »), garanties ou certifications absentes de la page retailer.

Prix : relevés avec leur date dans `produits.md`, reconfirmés le jour de la publication. Forme « ≈ 30 € » ou fourchette « 80 à 120 € » si le prix varie selon la taille.

Vocabulaire de l'eau : « imperméable » seulement avec un indice documenté (colonne d'eau en mm) ; sinon « résistant à l'eau » ou « déperlant ». Ne pas affirmer des coutures étanches si ce n'est pas écrit.

Rupture de stock : mentionnée factuellement, jamais présentée comme un défaut du produit.

## 3. Structure de l'article

1. **Intro** (paragraphe simple, 3 à 5 lignes) : mot-clé dans les deux premières phrases, critères qui comptent vraiment (nourris par la recherche usage), méthode de sélection en une phrase. Aucun lien vers un informatif.
2. **Bandeau affilié** (`affiliate-notice`).
3. **H2 « Comparatif des meilleurs … »** avec la grille de cartes `cmp-grid` (tout de suite, c'est la zone qui convertit).
4. **« Ces comparatifs pourraient aussi vous intéresser »** : `cta-grid` vers 2 comparatifs liés, si pertinent.
5. **Une fiche `prc` par produit**, chacune sous un H2 lien affilié « Nom exact : bénéfice ».
6. **« Quel … choisir selon votre profil ? »** : un paragraphe par produit, commençant par la situation du lecteur en gras.
7. **Partie usage, pour le SEO** (issue de `recherche.md`) : 2 à 4 H2 en questions du lecteur. Exemples : quel chien en a besoin, pièges à éviter, comment choisir la taille, compatibilité avec le harnais. C'est ici que peuvent aller les liens vers les informatifs.
8. **FAQ orientée achat et usage.**

## 4. Contenu des cartes et fiches

**Carte `cmp-card`**
- Badge : la qualité propre du produit (« Petit budget », « Harnais intégré », « Grand froid »), jamais un classement. Une couleur différente par carte : défaut vert forêt, `--amber`, `--blue`, `--violet`. Le choix mis en avant prend `cmp-card--featured` et un badge « ★ … ».
- Pitch : une phrase complète, courte et concrète, différente pour chaque produit. Pas de phrase tronquée.
- Specs : 2 à 3 maximum, parallèles d'une carte à l'autre (mêmes libellés).
- 4 produits : ajouter `cmp-grid--2`.

**Fiche `prc`**
- Étiquette (`prc__tag`) : l'usage en 1 à 2 mots.
- Description : factuelle, données taguées converties selon la section 2.
- « On apprécie » : 3 à 4 points. « Les limites » : 2 à 4 points, écrits franchement.
- « Idéal pour » : profils concrets.
- Un renvoi vers un autre comparatif peut suivre une fiche si le produit est souvent mal utilisé (exemple : manteau-harnais et canicross).

**Liens affiliés** : Hardloop en `tidd.ly`, Amazon en `amzn.to` ou `link.amazon` avec le tag affilié. Toujours `target="_blank" rel="nofollow sponsored"`. Fournis par Tom, jamais inventés.
