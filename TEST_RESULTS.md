# Vérifications V2.0 — 10 octobre 2026

Commande : `node tests/simulation.test.cjs`. **26 tests passés** ; les huit modules passent aussi `node --check` et le diff passe `git diff --check`.

## Couverture automatisée

- Migration des anciennes parties, bornage des valeurs invalides, aller-retour JSON et préservation des anciennes clés de stockage.
- Cuisine, repas, achats, provisions insuffisantes, plafond quotidien du travail et sommeil passant minuit.
- Initialisation des huit modules, boucle de rendu, affichage du portefeuille/besoins, menus et aperçu 3D avec DOM/WebGL simulés.
- Collisions des murs, meubles, porte, clôtures et limites ; déplacements subdivisés contre le passage à travers une barrière.
- Tous les objets interactifs atteignables depuis la maison ; trajets vers café, épicerie, parc et retour ; accès aux deux maisons des voisins.
- Trajets des trois habitants pendant cinq minutes simulées ; routines jour/nuit ; invitation avec arrivée physique à la maison et expiration.
- Annulation sans transaction, onglet masqué suspendu, effets de conversation uniquement à la fin de l’activité.
- Amitié, attente entre discussions, affection, couple et vie commune ; fiançailles avec seuils ; paiement du mariage uniquement au bon lieu et dans le bon état.
- Grossesse sauvegardée, naissance après trois jours, adoption, soins, coût des provisions, croissance en enfant, limite à deux enfants et conservation après séparation.
- Besoins des enfants pendant les heures sautées par sommeil, restauration du teint clair et de besoins à zéro.
- Déplacement des enfants sans collision, interactions suivant leur position et remplacement propre des étiquettes après changement de nom.
- Restauration des réglages de caméra/vêtements et invalidation des trajets ; caméra bornée à la pièce.
- Déclenchement des gestionnaires joystick/annulation et pincement à deux doigts dans le DOM simulé ; libération du suivi tactile.
- Concordance mathématique des articulations entre maillage de membre et position du genou.

La grille de 0,4 m atteint **17 823 positions**, avec vérification des segments intermédiaires. La scène contient 613 objets regroupés en 149 lots statiques, pour 220 872 sommets statiques. Ces mesures décrivent la géométrie, pas les FPS.

## Limites de vérification

Aucun navigateur de test pris en charge n’était disponible pour cette session. Le DOM et WebGL sont simulés : ils ne compilent pas les shaders sur un GPU, ne valident pas l’image produite, la mise en page Safari ou les événements tactiles natifs. Le test des gestionnaires ne remplace pas un vrai geste sur iPhone. Aucune fréquence d’images sur iPhone 16 n’a été mesurée.

## Recette Safari restante

1. Créer/reprendre un personnage et ouvrir son aperçu ; essayer tous les styles et revenir au jeu.
2. Joystick, course, rotation, pincement, suivi caméra ; passer en portrait/paysage et arrière-plan.
3. Marcher autour des meubles, ouvrir la porte, sortir du jardin, entrer dans les deux commerces et les maisons de Noah et Emma, revenir à pied.
4. Cuisiner, manger, se laver, dormir, travailler ; annuler une action et vérifier l’absence de dépense.
5. Rencontrer un habitant, discuter de ses centres d’intérêt, inviter et vérifier son arrivée ; progresser jusqu’à couple et vie commune.
6. Se fiancer, se rendre sous l’arche, célébrer le mariage ; adopter ou lancer une grossesse, sauvegarder, recharger et poursuivre.
7. Nourrir/câliner/jouer avec le bébé, avancer les jours en dormant et vérifier l’enfant mobile.
8. Exporter/restaurer ; vérifier la persistance des enfants, relations et réglages. Tester les trois résolutions et contrôler visuellement la fluidité.

La branche de développement ne remplace pas la V1 publiée sans accord.
