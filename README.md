# Mon Monde 3D — V2.2

Suite de la V1.0 : les quatre volets (confort, personnages, vie sociale, famille) sont réunis dans cette version. Le quartier reste continu et la maison, le jardin, les activités et les sauvegardes antérieures sont conservés. Jeu personnel WebGL 1, sans serveur de jeu, compte ni CDN. Le quartier est généré par le code ; les modèles humains CC0 sont inclus localement (voir `ASSETS.md`).

## Jouer

La racine du dépôt fonctionne sur GitHub Pages sans compilation. Pour un développement local, servir le dossier avec un serveur HTTP ; un HTML isolé ne suffit pas, car les scripts sont dans `src`.

Mobile : joystick, glissement pour tourner la caméra, deux doigts pour zoomer, Courir et bouton d’interaction. PC : ZQSD / WASD ou flèches, Maj pour courir, E pour interagir, souris et molette. Les menus suspendent le temps. Une activité peut être annulée sans transaction. Les commandes se libèrent à la perte de focus.

Style ouvre les réglages du personnage et l’aperçu 3D. Carte pose un repère sans téléportation. Le retour express propose une confirmation ; le trajet à pied reste toujours possible. Carnet contient les relations, souvenirs, progression de cuisine et export/import de sauvegarde. Foyer regroupe les étapes familiales.

Quitter la maison, traverser le jardin et le passage piéton : café à gauche, épicerie à droite, parc en face. Les maisons de Noah et Emma sont maintenant ouvertes et meublées, aux extrémités du quartier.

## Confort et personnages

- Mouvement progressif au joystick, rotation du personnage adoucie et déplacements par sous-pas contre le passage à travers les obstacles.
- Caméra lissée, distance réglable, suivi de direction optionnel, adaptation à l’intérieur et murs masqués dans la pièce occupée.
- Carte miniature et repères de destination ; affichage prévu pour portrait et paysage, avec zones de sécurité.
- Réglages de taille et silhouette, trois couleurs d’yeux, lunettes et trois looks prêts à porter. Quatre teints, trois formes de visage, trois coiffures, quatre couleurs de cheveux, quatre couleurs de vêtements et trois silhouettes vestimentaires.
- Deux maillages humains Quaternius avec visages, oreilles et mains détaillés, plus trois coiffures modélisées. Animation GPU sur 21 articulations ; doigts rigidement rattachés aux mains. Marche/course et hochements lors des discussions. Les teints et vêtements sont colorés par le moteur ; les textures originales ne sont pas utilisées. Poses pour dormir, cuisiner, manger, se doucher, s’asseoir, lire et câliner. Les activités principales positionnent visuellement le personnage près du meuble utilisé.

Le rendu reste stylisé. Il n’atteint pas le semi-réalisme d’un jeu commercial ; l’éditeur n’a pas de curseurs détaillés du visage et les mouvements de tête restent simples.

## Sexe et âge de départ

L’éditeur permet de choisir un sexe féminin ou masculin et un âge entier de 6 à 90 ans. Le choix du sexe sélectionne le maillage correspondant ; la morphologie reste personnalisable séparément. Les enfants (6–12 ans) et adolescents (13–17 ans) ont une taille adaptée, y compris le point visé par la caméra. Les choix sont conservés dans la sauvegarde, l’export/import et affichés dans Ma vie.

Les discussions et cadeaux restent amicaux avant 18 ans ; couple, rendez-vous romantiques, mariage et parentalité sont réservés aux adultes. Un foyer ayant déjà un partenaire, une grossesse ou des enfants ne peut pas être changé en personnage mineur ; l’import d’un foyer incohérent conserve sa progression avec un âge minimum de 18 ans.

Limites : l’âge du personnage joueur reste fixe. Les silhouettes jeunes utilisent les maillages adultes redimensionnés ; il n’y a pas encore de modèles d’enfants dédiés, de rides, de vieillissement du joueur ni de parcours scolaire. Les bébés et bambins du foyer sont des personnages non jouables. La croissance des enfants du foyer continue à suivre ses propres étapes fictives.

## Calibration V2.2

Zone de repos centrale de 18 % du joystick, réponse progressive, vitesse de marche 2,35 m/s et course 3,6 m/s. Relâcher le doigt arrête immédiatement l’entrée. Un second doigt ne prend plus le contrôle du joystick déjà utilisé. Le suivi de caméra conserve la direction initiale du geste ; il ne fait plus tourner involontairement la trajectoire du personnage. La caméra reste immobile pendant les menus et l’aperçu, et son point visé est lissé avec sa position. Sensibilité réduite par défaut, réglable dans Style, comme la zone de repos (10–30 %).

Les modèles utilisent deux appels de rendu (corps et cheveux), plus les accessoires éventuels. Un repli vers les modèles procéduraux existe si le shader humain n’est pas compatible avec le GPU. Le rendu GPU/Safari de cette nouvelle représentation reste à vérifier sur appareil. Les personnages restent stylisés, leurs vêtements sont simples et les expressions faciales n’ont pas de morphing détaillé. Les performances de la V2.1 validées par la propriétaire ne prouvent pas celles de la V2.2.

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
6. Une grossesse est visible par un ventre qui évolue en trois étapes et aboutit après trois jours de jeu ; l’adoption accueille immédiatement un bébé. Le bébé est visible dans son berceau. Nourrir utilise une provision ; câliner, jouer et apaiser augmentent ses besoins.
7. Après deux jours, le bébé devient un bambin mobile ; après quatre jours, il devient un enfant qui marche dans la maison et conserve ses interactions. Faim, réconfort et jeu diminuent avec le temps.

Les durées sont fictives : un jour normal correspond à environ 18 minutes de jeu actif ; dormir permet d’avancer de huit heures. La séparation conserve les enfants et une grossesse en cours. Partenaire, état du couple, grossesse, enfants, besoins et souvenirs sont sauvegardés.

Cette première simulation familiale n’inclut pas de génétique, d’école, d’adolescence, de vieillissement adulte, de scènes de cérémonie complexes ou de gestion autonome détaillée du partenaire. Les bambins et enfants peuvent suivre le joueur au parc puis rentrer par les chemins. L’aide du partenaire peut être activée pour des soins simples à proximité, espacés de deux heures de jeu. Les apprentissages augmentent un compteur, sans système scolaire.

## Ajouts de la V2.1

Le bouton **Ma vie** réunit les ambiances de maison, objectifs, destinations d’activités, sons facultatifs et conseils. Une humeur est calculée à partir des besoins ; elle renseigne le joueur sans multiplicateur caché.

- Trois ambiances gratuites : terracotta, sauge et lilas, appliquées aux murs, canapé et tapis. Composition florale à 25 pièces et guirlande à 35 pièces achetables à l’épicerie, aux emplacements prévus. Éclairage chaud simulé dans la maison et près des lampadaires le soir.
- Trois recettes : assiette maison (1 provision/1 portion), brunch (niveau 2, 2 provisions/3 portions), repas familial (niveau 5, 3 provisions/5 portions). Cuisine et quantités sont réellement enregistrées.
- Potager dans le jardin : semer coûte 5 pièces, récolter à partir du lendemain donne 3 provisions. Une récolte ne peut pas être prise deux fois. Compétence de jardinage.
- Table créative sur la terrasse : confectionner un bouquet consomme une provision ; offrir le bouquet augmente amitié et affection. Compétence créative. Dessiner restaure les loisirs, sans album d’images générées.
- Livraison à pied : prendre la commande au café, marcher jusqu’à la maison de Noah, la remettre pour 40 pièces. Une livraison par jour ; commande non livrée expirée le lendemain.
- Cinq objectifs vérifiés (repas, livraison, amitié, bouquets, enfant), avec récompenses à réclamer une seule fois.
- Rendez-vous au café : faire venir physiquement le partenaire, puis partager la pause à 12 pièces ; un rendez-vous renforce l’affection. Les plans de rendez-vous sont sauvegardés. Le mariage attend désormais le partenaire sous l’arche.
- Sortie familiale : les enfants mobiles suivent par les chemins et reviennent à pied à la maison. Le pique-nique consomme une portion et exige un enfant arrivé au parc ; les bébés restent au berceau. Les positions des enfants sont sauvegardées.
- Sons brefs originaux synthétisés lors des activités, désactivés au départ et activables par choix. Aucun fichier audio ni musique en continu.

La décoration propose des palettes et ajouts fixes, pas un mode construction avec placement libre. Les lumières sont une approximation légère sans ombres réalistes. Les dialogues et soins restent simples. Les bambins ne marchent pas dans les bras du joueur et les bébés ne peuvent pas sortir.

## Sauvegardes et architecture

Sauvegarde locale automatique toutes les six secondes et à la mise en arrière-plan, manuelle et export/import JSON validé. La V2 utilise `monmonde3d_v2` et reprend automatiquement `monmonde3d_v1`, puis les anciennes V0.2/V0.1, sans effacer ces clés. Les sauvegardes ne sont jamais envoyées au dépôt. Elles restent propres au navigateur et à l’appareil ; exporter permet de les transférer ou les conserver avant de vider Safari.

- `src/core.js` : règles pures, validation, économie, relations et cycle familial.
- `src/navigation.js` : recherche de chemins et déplacement avec collisions.
- `src/engine.js` : WebGL, matrices, géométries.
- `src/controls.js` : calibration et lissage des entrées.
- `src/characters.js` : accessoires et maillages procéduraux de secours.
- `src/humans.js` : modèles humains et animation GPU.
- `assets/humans.js` : données 3D compactées sous licence CC0.
- `src/world.js` : maison conservée et quartier meublé.
- `src/game.js` : boucle, caméra, commandes et persistance.
- `src/community.js` : routines, invitations, enfants et interactions.
- `src/ui.js` : conversations, famille, carnet, carte et aperçu.
- `src/enrichment.js` : recettes, maison, objectifs, activités supplémentaires, sorties et aide familiale.

## Validation et publication

`node tests/simulation.test.cjs` : 43 tests de règles et d’intégration DOM/WebGL simulée. Voir `TEST_RESULTS.md` pour les détails et les vérifications Safari restantes. 613 objets regroupés en 149 lots statiques, 220 872 sommets statiques. Résolution réglable 1, 1.35 ou 1.7 pixel par pixel CSS. Ces chiffres ne constituent pas une mesure de FPS.

Branche de travail : `develop/v2.2`. La V2.1 est publiée sur `main`. Elle reste préservée jusqu’à un nouvel accord de publication de la V2.2. Les candidates précédentes sont conservées sur leurs branches. Une fusion sur `main` déclenchera le déploiement GitHub Pages existant. L’archive V0.2 est conservée dans `archive/v0.2`. Aucun transfert manuel de HTML n’est nécessaire.
