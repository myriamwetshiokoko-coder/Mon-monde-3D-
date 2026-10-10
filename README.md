# Mon Monde 3D — V2.0

Suite de la V1.0 : les quatre volets (confort, personnages, vie sociale, famille) sont réunis dans cette version. Le quartier reste continu et la maison, le jardin, les activités et les sauvegardes antérieures sont conservés. Jeu personnel WebGL 1, sans serveur de jeu, compte, CDN ni modèles externes. Les ressources originales sont générées par le code.

## Jouer

La racine du dépôt fonctionne sur GitHub Pages sans compilation. Pour un développement local, servir le dossier avec un serveur HTTP ; un HTML isolé ne suffit pas, car les scripts sont dans `src`.

Mobile : joystick, glissement pour tourner la caméra, deux doigts pour zoomer, Courir et bouton d’interaction. PC : ZQSD / WASD ou flèches, Maj pour courir, E pour interagir, souris et molette. Les menus suspendent le temps. Une activité peut être annulée sans transaction. Les commandes se libèrent à la perte de focus.

Style ouvre les réglages du personnage et l’aperçu 3D. Carte pose un repère sans téléportation. Le retour express propose une confirmation ; le trajet à pied reste toujours possible. Carnet contient les relations, souvenirs, progression de cuisine et export/import de sauvegarde. Foyer regroupe les étapes familiales.

Quitter la maison, traverser le jardin et le passage piéton : café à gauche, épicerie à droite, parc en face. Les maisons de Noah et Emma sont maintenant ouvertes et meublées, aux extrémités du quartier.

## Confort et personnages

- Mouvement progressif au joystick, rotation du personnage adoucie et déplacements par sous-pas contre le passage à travers les obstacles.
- Caméra lissée, distance réglable, suivi de direction optionnel, adaptation à l’intérieur et murs masqués dans la pièce occupée.
- Carte miniature et repères de destination ; affichage prévu pour portrait et paysage, avec zones de sécurité.
- Quatre teints, trois formes de visage, trois coiffures, quatre couleurs de cheveux, quatre couleurs de vêtements et trois silhouettes vestimentaires.
- Maillages anatomiques originaux à anneaux, membres articulés, marche/course, respiration, clignements et bouche animée pendant la discussion. Poses pour dormir, cuisiner, manger, se doucher, s’asseoir, lire et câliner. Les activités principales positionnent visuellement le personnage près du meuble utilisé.

Le rendu reste stylisé et procédural. Il n’atteint pas le semi-réalisme d’un jeu commercial ; l’éditeur n’a pas de curseurs détaillés du visage et les expressions restent simples.

## Simulation quotidienne et sociale

Cuisiner consomme une provision et prépare une portion ; manger à table la consomme. Douche, sommeil, télévision, détente, arrosage, lecture et méditation restaurent les besoins. Les cinq besoins diminuent durant le jeu ; une énergie faible ralentit la marche. Sommeil et travail font avancer l’horloge et diminuent également les besoins pendant les heures écoulées.

120 pièces et trois provisions au départ. Trois provisions coûtent 18 pièces, café/pâtisserie 12 pièces. Un service au café est disponible une fois par jour : 65 pièces plus un bonus de cuisine plafonné à 20, fatigue et trois heures de jeu. La cuisine augmente la compétence.

Lina, Noah et Emma ont des centres d’intérêt distincts et des destinations quotidiennes : domicile, café, ville, parc et soirée. Leurs trajets respectent les collisions. Discussions, anecdotes et sujets préférés augmentent l’amitié ; les compliments romantiques augmentent l’affection. Une courte attente entre les conversations évite la progression instantanée. À partir de 20 d’amitié, une invitation les fait venir physiquement à la maison pendant quatre heures de jeu.

Les dialogues sont courts et prédéfinis. Il n’y a pas de conversation générée, d’inventaire détaillé, de circulation automobile ou de carrière complète.

## Famille réellement implémentée

1. Se connaître : amitié 55 et affection 40 pour devenir un couple ; les premiers compliments demandent amitié 35.
2. Emménager ensemble : le partenaire rejoint la Maison Soleil le soir et la nuit.
3. Se fiancer après un jour de couple et affection 75 : 25 pièces.
4. Célébrer le mariage sous l’arche du parc : 40 pièces.
5. Avec un partenaire vivant dans le foyer, choisir une grossesse ou une adoption et nommer le bébé : 30 pièces, maximum deux enfants. Le mariage n’est pas obligatoire.
6. Une grossesse aboutit après trois jours de jeu ; l’adoption accueille immédiatement un bébé. Le bébé est visible dans son berceau. Nourrir utilise une provision ; câliner, jouer et apaiser augmentent ses besoins.
7. Après quatre jours, le bébé devient un enfant qui marche dans la maison et conserve ses interactions. Faim, réconfort et jeu diminuent avec le temps.

Les durées sont fictives : un jour normal correspond à environ 18 minutes de jeu actif ; dormir permet d’avancer de huit heures. La séparation conserve les enfants et une grossesse en cours. Partenaire, état du couple, grossesse, enfants, besoins et souvenirs sont sauvegardés.

Cette première simulation familiale n’inclut pas de grossesse visuellement évolutive, de génétique, d’école, d’adolescence, de vieillissement adulte, de scènes de cérémonie complexes ou de gestion autonome détaillée du partenaire. Les enfants se déplacent dans la maison et leurs soins sont pilotés par le joueur.

## Sauvegardes et architecture

Sauvegarde locale automatique toutes les six secondes et à la mise en arrière-plan, manuelle et export/import JSON validé. La V2 utilise `monmonde3d_v2` et reprend automatiquement `monmonde3d_v1`, puis les anciennes V0.2/V0.1, sans effacer ces clés. Les sauvegardes ne sont jamais envoyées au dépôt. Elles restent propres au navigateur et à l’appareil ; exporter permet de les transférer ou les conserver avant de vider Safari.

- `src/core.js` : règles pures, validation, économie, relations et cycle familial.
- `src/navigation.js` : recherche de chemins et déplacement avec collisions.
- `src/engine.js` : WebGL, matrices, géométries.
- `src/characters.js` : maillages, personnalisation et animations.
- `src/world.js` : maison conservée et quartier meublé.
- `src/game.js` : boucle, caméra, commandes et persistance.
- `src/community.js` : routines, invitations, enfants et interactions.
- `src/ui.js` : conversations, famille, carnet, carte et aperçu.

## Validation et publication

`node tests/simulation.test.cjs` : 26 tests de règles et d’intégration DOM/WebGL simulée. Voir `TEST_RESULTS.md` pour les détails et les vérifications Safari restantes. 613 objets regroupés en 149 lots statiques, 220 872 sommets statiques. Résolution réglable 1, 1.35 ou 1.7 pixel par pixel CSS. Ces chiffres ne constituent pas une mesure de FPS.

Branche de travail : `develop/v2.0`. La version V1 publiée sur `main` reste préservée jusqu’à un nouvel accord de publication. Une fusion sur `main` déclenchera le déploiement GitHub Pages existant. L’archive V0.2 est conservée dans `archive/v0.2`. Aucun transfert manuel de HTML n’est nécessaire.
