# SEO nature-et-chien.fr

Règles SEO à appliquer au cadrage et à la rédaction. Site jeune, peu d'autorité : on gagne par la précision de l'intention, les featured snippets et la confiance (EEAT).

## 1. Cadrage du mot-clé

- **Focus keyword** : 4 à 8 mots, formulé comme un humain le tape dans Google (ou le demande à un assistant IA).
- **Intention** :

| Intention | Signaux | Format |
|---|---|---|
| Informationnelle | comment, pourquoi, est-ce que, quand, quel (au sens « lequel convient ») | Informatif : H2 en sous-questions, réponse directe, FAQ |
| Commerciale | meilleur, comparatif, avis, quel choisir (avec achat en vue) | Comparatif : cartes produit, fiches, FAQ achat |
| Transactionnelle ou navigationnelle | acheter, prix, nom de marque | Hors cible |

  Une intention mixte donne un informatif avec CTA vers le comparateur, jamais un hybride.
- **Données chiffrées** : ne jamais inventer volume, KD ou positions. Demander à Tom la vérification Semrush précise (terme exact, métrique à relever).
- **SERP** : type de contenus en positions 1 à 3 (blog, institutionnel, boutique, forum), fraîcheur, ce qui est bien et mal couvert. L'angle différenciant répond à un manque réel.
- **Décision** : GO, GO avec autre angle, à creuser (donnée manquante), à éviter (trop concurrentiel, déjà couvert, hors niche).
- **Champ sémantique** : variantes groupées par thème. Repérer celles qui méritent un article distinct plutôt qu'une intégration.

## 2. Cannibalisation

- Une requête = un article. Vérifier dans `MAILLAGE.md` qu'aucun article ne répond déjà à la même question du lecteur.
- Intentions différentes (informatif et comparatif sur un même thème) : coexistence normale, reliés par des liens.
- Même intention : différencier nettement l'angle, ou proposer à Tom une fusion.
- Un terme réservé à un futur article (exemple : « imperméable » réservé au comparatif pluie) n'apparaît ni dans le title, ni dans le metaTitle, ni dans un H2.

## 3. Structure

- **H1** (champ `title`) : contient la requête exacte. Si la requête est une question, le H1 est une question. Pas de reformulation créative.
- **Introduction** : 3 à 5 lignes. Focus keyword dans les deux premières phrases. Nomme le problème concret du lecteur et annonce ce qu'il va trouver. Pas de généralité académique.
- **H2** : formulés comme les questions réelles du lecteur, jamais comme des titres de chapitre. « Pourquoi le chien se déshydrate-t-il plus vite que nous ? » et non « L'importance de l'hydratation ». Alterner les variantes sémantiques (balade, randonnée, sortie).
- **Nombre de H2** : 3 à 6 pour un article standard (800 à 1 500 mots), plus de 6 pour un guide pilier (1 800 à 2 200 mots). Décidé au plan, jamais de rembourrage.
- **Premier H2** : la réponse principale.
- **H3** autorisés pour découper un H2 dense.
- **Tableau** dès qu'il y a comparaison, progression ou règles selon les cas.

## 4. Featured snippet

Une seule cible par article, choisie au cadrage :
- **Paragraphe** (qu'est-ce que, pourquoi, est-ce que, peut-on) : H2 question, puis réponse de 40 à 60 mots qui commence au premier mot, sans « Il faut savoir que ».
- **Liste** (signes, étapes, comment) : phrase d'amorce avec le mot-clé, 5 à 8 items courts et parallèles, pas de sous-liste.
- **Tableau** (selon le gabarit, différence entre) : en-têtes explicites, 3 à 6 lignes, données vérifiables.

Dans chaque section pertinente, la réponse directe tient dans les deux premières phrases.

## 5. FAQ

- 5 à 6 questions, toujours présentes, en accordéon (`mise-en-forme.md`).
- Tirées des vraies requêtes : PAA, autocomplétion, forums, et formulations qu'on poserait à un assistant IA. Pas de questions construites pour faire joli.
- Plus personnelles et naturelles que les H2 : « Mon chien tremble en randonnée, est-ce qu'il a froid ? ». Elles captent la longue traîne et peuvent élargir légèrement le sujet.
- Angles distincts du corps : une FAQ qui double un H2 est supprimée ou reformulée.
- Réponse de 2 à 5 phrases, la réponse directe en premier.

## 6. Metas et frontmatter

- **`metaTitle`** : 50 à 60 caractères, mot-clé en tête. Affiché seul sur les articles (le nom du site n'est ajouté qu'à l'accueil et aux pages de catégorie). Au-delà de 60, Google coupe.
- **`metaDescription`** : 145 à 160 caractères. Orientée clic : questions implicites ou inquiétudes du lecteur, bénéfice concret. Pas de réponse directe en ouverture (pas de « Oui, … »). Formulation différente du metaTitle. Contient le mot-clé.
- **`description`** : champ distinct (cartes et listes du site), 1 à 2 phrases, bénéfice concret. Sur un article existant, ne jamais la modifier sans demande de Tom.
- **`focusKeyword`** : la requête exacte validée au cadrage.
- **Image** : `/images/<categorie>/<slug>/cover.webp`, `imageAlt` descriptif et précis. Tom fournit le fichier, le chemin est fixé au plan.
- **Aucun placeholder** à la livraison.

Informatif :
```yaml
---
title: "…"
description: "…"
publishDate: AAAA-MM-JJ
category: avant-de-partir | sante | equipement
tags: [tag1, tag2, tag3]
isAffiliate: false
featured: false
theme: …            # si l'article appartient à un thème produit (harnais, manteau…)
focusKeyword: "…"
image: /images/…/cover.webp
imageAlt: "…"
metaTitle: "…"
metaDescription: "…"
---
```

Comparatif : mêmes champs avec `isAffiliate: true`, `category: equipement`, `theme` obligatoire et `itemList` (noms exacts des produits, dans l'ordre des cartes). Ajouter `updatedDate` lors d'une mise à jour, sans toucher à `publishDate`.

Rappel : la catégorie santé s'écrit `sante` dans le frontmatter, l'URL publique est `/sante-bien-etre/<slug>/`.

## 7. EEAT dans le texte

| Signal | Mise en pratique |
|---|---|
| Expérience | Situations terrain réelles et précises |
| Expertise | Chiffres sourcés, recommandations vétérinaires ou officielles citées |
| Autorité | 1 à 2 liens vers des sources officielles ou scientifiques |
| Confiance | Incertitudes signalées, rien de médical sans source, limites des produits écrites franchement |

## 8. Après publication

- **Maillage rétroactif** : chercher dans `src/content/` les articles qui parlent du sujet sans y renvoyer, proposer à Tom 1 à 3 insertions de liens (phrase exacte et emplacement). Un comparatif doit être commité avant l'informatif qui pointe vers lui.
- **Mise à jour** des articles clés tous les 12 à 18 mois : chiffres, lois, liens externes, stocks et prix. `updatedDate` ajoutée.

## 9. Checklist finale (après `npm run check`)

- [ ] H1 = requête exacte ; mot-clé dans les deux premières phrases
- [ ] Premier H2 = réponse principale ; tous les H2 en questions du lecteur
- [ ] Une cible de snippet traitée au bon format
- [ ] Chaque fait vérifiable : niveau 1 ou consensus bien formulé ; santé conforme
- [ ] Liens internes 1 à 4 depuis MAILLAGE.md, CTA au bon endroit
- [ ] 1 à 2 liens externes vérifiés
- [ ] FAQ 5 à 6 questions naturelles, distinctes du corps
- [ ] Metas aux bonnes longueurs, orientées clic
- [ ] Aucune contradiction interne, aucune redondance avec un autre article
- [ ] Informatif : aucune marque
