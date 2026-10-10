# Vérifications V2.3.1 — 10 octobre 2026

Commandes : `node tests/simulation.test.cjs` (63 tests) et `node tests/daily.test.cjs` (7 tests). **70 tests passés** ; tous les modules passent aussi `node --check` et le diff passe `git diff --check`.

## Couverture automatisée

- Migration des anciennes parties, bornage des valeurs invalides, aller-retour JSON et préservation des anciennes clés de stockage.
- Cuisine, repas, achats, provisions insuffisantes, plafond quotidien du travail et sommeil passant minuit.
- Initialisation de tous les modules, boucle de rendu, affichage du portefeuille/besoins, menus et aperçu 3D avec DOM/WebGL simulés.
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

La grille de 0,4 m atteint **17 819 positions**, avec vérification des segments intermédiaires. La scène contient 646 objets regroupés en 176 lots statiques, pour 224 388 sommets statiques. Ces mesures décrivent la géométrie, pas les FPS.

## Ajouts testés en V2.1

Onze tests supplémentaires vérifient : recettes débloquées et portions ; récolte différée et non duplicable ; bouquets et cadeaux ; récompenses uniques ; livraison avec collecte/destination/expiration ; achat unique des décorations et personnalisation ; bambins/apprentissages/pique-nique ; suivi familial jusqu’au parc et retour collision-safe ; sauvegarde des positions ; soins du partenaire même quand le joueur est ailleurs, avec dépense de provisions et espacement ; menus reliés aux transactions ; rendez-vous sauvegardés ; attente physique du partenaire avant le mariage ; reprise d’un retour familial après rechargement.

Les scènes dynamiques du potager et des décorations achetées ajoutent des appels de rendu aux 159 lots statiques ; le total exact varie selon la position et le foyer. La V2.1 n’ajoutait pas de modèle externe. La V2.2 ajoute environ 1 Mo de modèles humains servis par le même dépôt.

## Calibration et personnages V2.2

Six tests supplémentaires vérifient : zone de repos et progressivité du joystick ; sensibilité et lissage indépendants de la cadence ; trajectoire droite malgré le suivi de caméra ; indices des modèles, normales et poids totalisant 255 ; matrices finies pour toutes les poses et bras animés ; passage des deux morphologies et trois coiffures dans le rendu simulé. L’import de données 3D ne dépend pas du réseau pendant le jeu.

La propriétaire a confirmé la fluidité générale de la **V2.1** sur iPhone 16, tout en signalant une sensibilité excessive et des personnages insatisfaisants. Cette observation ne valide pas encore la V2.3.

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
8. Utiliser Ma vie, appliquer les ambiances, acheter les décorations, semer/récolter, confectionner/offrir des bouquets, débloquer les recettes et réclamer des objectifs.
9. Tester le joystick près du centre, les deux réglages de calibration, le suivi caméra avec un geste maintenu en ligne droite, les deux morphologies et les poses des modèles humains.
10. Prendre une livraison, marcher chez Noah et recevoir le salaire. Vérifier le refus d’une seconde livraison le même jour.
10. Planifier un rendez-vous et faire venir le partenaire à la cérémonie. Activer l’aide aux enfants, la sortie familiale, attendre les enfants au parc, pique-niquer et rentrer. Recharger pendant la sortie et le retour.
11. Tester yeux, silhouette, taille, lunettes, looks, ventre évolutif et sons facultatifs.
12. Exporter/restaurer ; vérifier la persistance des enfants, relations et réglages. Tester les trois résolutions et contrôler visuellement la fluidité.

La publication de la V2.3.1 a été autorisée le 10 octobre 2026, après présentation des correctifs et des 70 tests. La candidate testée reste conservée dans l’historique de `develop/v2.3.1` ; la publication ne modifie que le statut de ces documents.

## Sexe et âge de départ

Cinq tests supplémentaires vérifient la migration et les bornes 6–90 ans, les étapes d’âge et la taille, l’absence de vieillissement automatique, les transactions adultes bloquées sans dépense pour les mineurs, les cadeaux amicaux, la conservation des foyers adultes à l’import, les vrais gestionnaires de sélection, l’aperçu dans le rendu simulé, la sauvegarde/reprise du profil et l’absence de boutons romantiques pour un personnage enfant. Le rendu à taille réduite utilise les modèles existants ; les apparences d’enfant et d’aîné ne constituent pas des modèles dédiés.

## Travail, économie et téléphone V2.3

Quatorze nouveaux tests couvrent : solde et historique cohérents, achats refusés sans transaction, bornes des historiques, migration du solde ancien, métiers réservés aux adultes, lieu et horaires de prise de service, blocage d’un second service, ordre des tâches et refus à distance, sauvegarde à chaque étape, salaire versé une seule fois, progression après trois services, livres et repas avec prix/lieu vérifiés, messages amicaux avec attente et rendez-vous persistants.

Les tests d’intégration déclenchent les boutons du téléphone et des menus de travail, valident un service complet avec annulation/reprise, lisent le crédit dans l’écran du compte, déclenchent lecture/repas/télévision, vérifient les choix sauvegardés, le déplacement du couvert avec la main, les matrices des nouvelles poses, les routes des habitants jusqu’à leurs repas/lectures/TV et la rencontre proposée par téléphone. Tous les nouveaux postes ont une route depuis la maison sans traverser les obstacles. Le simulateur DOM prend désormais en charge les enfants multiples de `append` et l’état `hidden` initial du HTML.

Correction vérifiée pendant ces scénarios : la restauration efface les animations de soin transitoires des habitants afin de reprendre leurs routines actuelles. La tenue du service est temporaire ; les modèles humains existants sont conservés.

## Vérification iPhone V2.3 à effectuer après publication

- Ouvrir Téléphone en portrait et paysage, faire défiler chaque application, vérifier pause/reprise et lisibilité.
- Choisir un emploi, suivre chaque poste, annuler/reprendre une tâche et recharger au milieu du service ; collecter le salaire et vérifier son inscription au compte.
- Acheter un livre et un repas au bon commerce, lire sur le canapé ou debout, manger à table, changer/éteindre la télévision. Contrôler visuellement mains, objets et sièges.
- Envoyer un message, proposer une rencontre au parc, attendre l’habitant, sauvegarder et recharger. Observer petit déjeuner, lecture et TV des habitants aux heures correspondantes.
- Vérifier les versions des scripts après rechargement et la fluidité selon le réglage de résolution. Le GPU, la mise en page Safari et les FPS restent non mesurés ici.

## Diagnostic et correctifs V2.3.1

L’enregistrement iPhone fourni, d’environ 2 min 35, montre la V2.3 en utilisation réelle malgré le bandeau resté en V2.2. Les déplacements, le téléphone et une livraison rémunérée y sont observés. Il montre aussi une robe avec un torse superposé, des meubles devant le joueur, des étiquettes derrière le HUD et un démarrage du service sans retour visible après 20 h. Le refus horaire est conforme aux règles ; son message était derrière le menu. Cette observation ne valide ni le correctif ni les FPS.

Huit tests de régression supplémentaires vérifient : fermeture explicite et boutons inactifs ; messages d’échec devant menus/téléphone sans mutation de la partie ; résultat de livraison seulement à la fin et achat annulable ; jupe aux poids normalisés, indices valides, sommets bornés et déformés en marche/position assise, sans second torse ; discussion sans ancrage sur chaise, dîners avec siège et chaise libre conservée pour le joueur ; rayons caméra/meuble, maintien des collisions et restauration de l’opacité/écriture de profondeur ; noms ne recouvrant pas les rectangles du HUD ou les autres noms ; version identique du bandeau et des 15 scripts.

Le regroupement des meubles occultants passe de 159 à 176 lots statiques sans ajout de sommets au décor. Chaque jupe ajoute 125 sommets et 192 triangles, générés une fois, soit un appel de rendu supplémentaire pour le style robe. La transparence conserve les géométries déjà chargées. Ces chiffres ne garantissent pas un débit d’images sur iPhone.

Recette ciblée restante : faire tourner la caméra autour du comptoir et des tables ; regarder les robes en marche, assise et en conversation ; manger au café avec les habitants ; tenter un service après 20 h puis le lendemain après 8 h ; provoquer un achat refusé dans un menu et dans le téléphone ; vérifier les étiquettes en portrait/paysage et recharger la sauvegarde. Aucun enregistrement, image de diagnostic ou sauvegarde privée n’est inclus dans le dépôt.
