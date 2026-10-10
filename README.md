# Mon Monde 3D — V1.0 (candidate à tester sur iPhone)

Jeu personnel WebGL 1, sans compte, serveur, CDN ni téléchargement de modèles. Toutes les ressources visuelles sont générées par le code. La maison, le jardin, la porte automatique, les activités et les commandes de la V0.2 sont conservés.

## Jouer

Servir le dossier avec `python3 -m http.server 8000`, puis ouvrir http://localhost:8000. La racine du dépôt fonctionne directement sur GitHub Pages, sans compilation. Ne pas ouvrir un fichier HTML isolé : il dépend du dossier `src`.

Mobile : joystick pour marcher, glissement sur la scène pour tourner la caméra, boutons Courir et interaction. PC : ZQSD / WASD ou flèches, Maj pour courir, E pour interagir. Style permet de modifier le personnage. Carnet affiche les relations, les lieux et les commandes ; il permet d’exporter et de restaurer une partie.

Quitter la maison par la porte, traverser le jardin puis le passage piéton. Café Fleur à gauche, épicerie à droite, parc tout droit. Les commerces ont de vraies ouvertures, un intérieur meublé et des collisions. Deux maisons latérales restent décoratives et fermées.

## Mécaniques implémentées

- Petit quartier continu, jardin et maison existants, café, épicerie, parc.
- Quatre teints, quatre couleurs de tenue, trois coiffures et trois largeurs du visage. Visage avec yeux, nez et bouche ; silhouettes organiques procédurales, proportions plus naturelles, marche/course, pose allongée pour dormir.
- Cuisiner consomme une provision et prépare une portion ; manger à la table consomme cette portion et restaure la faim.
- Douche, sommeil, télévision, détente, jardinage, lecture et méditation.
- Cinq besoins qui diminuent pendant le jeu ; énergie très faible ralentit la marche.
- Trois habitants en déplacement, discussions, relations de 0 à 100, amitié à 48.
- 120 pièces initiales, trois provisions ; achat de trois provisions à 18 pièces, café/pâtisserie à 12 pièces, service au café à +65 pièces une fois par jour, avec fatigue et avance de trois heures.
- Jour/nuit avec modulation de lumière ; pause pendant les menus et lorsque l’onglet est masqué.
- Annulation d’activité sans dépense ni récompense ; effects appliqués uniquement à la fin.
- Sauvegarde automatique toutes les six secondes et lorsque l’onglet est masqué ; sauvegarde manuelle, export/import JSON validé.
- Migration locale depuis `monmonde3d_v02` ou `monmonde3d_v01` sans effacer les anciennes clés. La V1 utilise `monmonde3d_v1`. Les sauvegardes restent sur l’appareil et ne sont jamais envoyées au dépôt.

## Architecture

`src/core.js` : règles pures, validation de sauvegarde, besoins, économie et transactions.
`src/engine.js` : WebGL, géométries et matrices.
`src/world.js` : scène conservée et quartier, volumes de collision des ajouts.
`src/game.js` : boucle, UI, personnages, habitants, interactions et persistance.

Le champ `family` réserve une structure pour un partenaire et des enfants. Couples, mariage, grossesse, bébés et enfants **ne sont pas implémentés**. Les conversations restent courtes, sans système de dialogue complexe. Les vêtements changent de couleur ; il n’y a pas de catalogue d’articles ni d’éditeur détaillé du visage. Le rendu reste stylisé et procédural, pas semi-réaliste au niveau d’un jeu commercial. Il n’y a pas de trafic automobile ni de simulation d’emplois complète.

## Validation

`node tests/simulation.test.cjs` : tests des règles et intégration dans un environnement DOM/WebGL simulé, parcours des collisions par grille et patrouilles des habitants. Voir `TEST_RESULTS.md` pour les résultats et limites.

132 lots statiques / 181 764 sommets statiques au lieu de 503 appels par objet. Résolution réglable (1, 1.35 ou 1.7 pixels par pixel CSS). Cela réduit le coût côté CPU ; ce n’est pas une mesure de FPS sur iPhone.

## Publication

Branche de développement : `develop/v1.0`. L’accès GitHub en écriture a été vérifié et cette branche contient la V1.0 candidate. `main` et GitHub Pages restent inchangés jusqu’à l’accord de la propriétaire. Après accord : comparer la branche, fusionner dans `main`, attendre le déploiement Pages et vérifier sur Safari iPhone en portrait et paysage. La publication utilise le dépôt existant : aucune réimportation manuelle de HTML nécessaire. Ne jamais ajouter une sauvegarde exportée au dépôt.
