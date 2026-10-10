# Mon Monde 3D — V2.4.0

Jeu personnel de simulation de vie en 3D, pour Safari sur iPhone et les navigateurs d’ordinateur. Cette version reprend le projet existant, sa maison, son jardin, ses activités et ses sauvegardes. Le quartier reste continu. Les modèles humains CC0 sont inclus localement ; le jeu ne télécharge aucune ressource externe.

**V2.4.0 : publication autorisée par la propriétaire le 10 octobre 2026 sur `main` et GitHub Pages. La branche `develop/v2.4` conserve le travail de développement.**

## Nouveautés jouables

- Marche orientée vers le déplacement. Conversations face à face, personnes espacées et caméra cadrant le duo. Les habitants quittent leur siège pour discuter. Portes, montants et meubles masquant les acteurs rejoignent le rendu en coupe ou la transparence.
- Deux corps humains articulés, six styles vestimentaires, six teints, huit couleurs de haut, cinq coiffures et cinq couleurs de cheveux. Chemise/pantalon, blouse/jupe, T-shirt/short, polo/jean, pull à manches longues, tenue de sport. Couleurs indépendantes du pantalon et des chaussures. Sexe, âge de départ, morphologie, silhouette, taille, visage, yeux et lunettes restent réglables.
- Huit habitants : Lina, Noah, Emma, Adam, Inès, Sami, Jade et Hugo. Chacun conserve sa position, ses besoins, son emploi éventuel et sa progression de service. Ils mangent, lisent, se reposent, se rendent au travail et engagent des discussions entre eux.
- Trois métiers sur place : café, épicerie et jardinage. Quatre tâches visibles puis retour au poste de départ pour recevoir le salaire. Gestes et accessoires : assiette, commandes, provisions, arrosoir et balai. Les habitants employés suivent également ces postes physiquement.
- Le conjoint cohabitant a un métier choisi dans **Menu → Mon foyer → Métier et journée**. Son salaire rejoint le compte du foyer après son service complet, une fois par jour. Celui du joueur s’y ajoute. Le conjoint peut cuisiner deux repas avec une provision, manger un repas du foyer, se rafraîchir, se détendre, dormir et aider les enfants lorsque cette option est activée.
- Projet de bébé : vie commune, présence à la maison et partenaire proche. **Préparer notre projet à la maison** lui donne un rendez-vous ; fermer les menus puis attendre son arrivée. Choix du prénom et de la personne portant la grossesse. Grossesse de trois jours fictifs ; adoption disponible, notamment si aucune personne du couple ne peut porter la grossesse. Paiement après le moment partagé ; annulation gratuite. Les anciennes grossesses et les enfants sont conservés.
- Trois logements meublés et visitables : Soleil, Sauge et Roseraie. Le déménagement conserve enfants, provisions, meubles et relations ; les activités et rendez-vous domestiques suivent le logement. Retour gratuit dans un logement déjà acquis.
- Plan tactile pour acheter, placer, tourner, déplacer, ranger et réinstaller jusqu’à dix meubles supplémentaires : fauteuil, plante, lampadaire, bureau et tapis. Le placement refuse murs, meubles, personnes et passages ; un contrôle de trajet protège l’accès aux pièces. Fauteuil/bureau permettent de lire, plante d’arroser. Paiement après confirmation du placement.
- Quatre voitures circulent sur deux voies et cèdent le passage. Les personnages évitent leur volume et un habitant bloqué adapte son trajet. Au rechargement, les voitures apparaissent à distance des personnages.

## Fonctions conservées

Maison et jardin d’origine, rues, parc, café, épicerie et maisons de Noah et Emma accessibles à pied ; caméra à la troisième personne ; marche et course ; besoins de faim, énergie, hygiène, loisirs et vie sociale ; cuisine/recettes, table, douche, repos, livres et télévision ; potager, bouquets, cadeaux, objectifs et livraisons ; amitié, couple, vie commune, fiançailles, mariage, soins aux enfants et sorties familiales ; téléphone avec messages fictifs, contacts, agenda, compte, emplois, bibliothèque et adresses ; jour/nuit et ambiances intérieures.

Les modèles portent des vêtements distincts, avec articulations animées, ombres de contact, accessoires en main et pieds ajustés au sol en position assise. L’interface compacte conserve les anciens raccourcis dans Menu.

## Commandes et parcours

Sur iPhone : joystick pour marcher, **Courir** pour changer d’allure, glissement pour tourner la caméra, pincement à deux doigts pour régler la distance. **Style** ouvre apparence, sensibilité, zone de repos du joystick, suivi de direction et résolution : Économie, Équilibré ou Détaillé.

Sur ordinateur : ZQSD, WASD ou flèches ; Maj pour courir ; E pour interagir ; glissement pour la caméra, molette pour zoomer. Approcher un objet ou un habitant active le bouton d’interaction. Les activités peuvent être annulées. Les menus mettent le temps en pause.

Travail : **Téléphone → Emplois**, choisir un métier, marcher au poste de départ entre 8 h et 20 h, rejoindre chaque repère puis revenir au comptoir. Les habitants employés commencent entre 8 h et midi. Aucune rémunération n’est calculée pendant l’absence du joueur.

Logement : **Menu → Mon foyer → Logement et aménagement**, ou l’application **Foyer** du téléphone. Visiter donne un repère sans téléporter le personnage. Placer les meubles depuis son propre logement, sur le plan, avec des pas de 25 cm et une rotation à 90°.

## Sols et sauvegardes

Les **sols** sont une monnaie virtuelle. Aucun paiement ni compte bancaire réel. Achats, salaires et objectifs partagent un compte avec les 40 dernières opérations. Les refus et annulations ne changent pas le solde.

| Action | Sols |
| --- | ---: |
| Salaire de base café / épicerie / jardinage | 65 / 60 / 55 |
| Livraison terminée chez Noah | 40 |
| Trois provisions | 18 |
| Café/pâtisserie / repas à emporter | 12 / 16 |
| Projet de bébé / adoption | 30 |
| Maison Sauge / Roseraie | 280 / 420 |
| Fauteuil / plante / lampadaire / bureau / tapis | 45 / 20 / 30 / 65 / 25 |

Le salaire du joueur progresse avec ses services terminés. Le solde de la partie précédente est conservé ; une nouvelle partie commence avec 120 sols et trois provisions.

Sauvegarde automatique locale toutes les six secondes de jeu et à l’arrière-plan, sauvegarde manuelle depuis Menu. Les clés antérieures V0.1, V0.2 et V1 restent reconnues ; schéma `version: 2` et clé `monmonde3d_v2` conservés. Les nouveaux champs sont ajoutés à la reprise. Une position occupée reprend à l’entrée du logement ; un meuble importé dans un passage reste dans l’inventaire.

**Carnet → Sauvegarde et commandes** permet l’export/import. Les sauvegardes restent sur l’appareil ou dans le fichier exporté par la joueuse et ne sont jamais envoyées à GitHub. Effacer les données de Safari efface la sauvegarde locale : un export permet de la conserver.

## Vérifications et architecture

108 tests locaux passent : 73 de simulation/intégration, 7 d’économie/métiers, 28 du quartier/foyer. Les gestionnaires d’interface sont exécutés avec DOM et WebGL simulés. Des rendus EGL/OpenGL ES compilent les shaders et dessinent les scènes réelles hors navigateur ; détails dans `TEST_RESULTS.md`.

```sh
node tests/simulation.test.cjs
node tests/daily.test.cjs
node tests/neighbourhood.test.cjs
```

Le workflow **Vérifications du jeu** exécute ces suites sur `main`, `develop/**` et les pull requests. Il ne publie pas le jeu. La mise en ligne conserve le dépôt et la configuration GitHub Pages existants après accord, sans remplacement manuel du HTML.

Modules : `town.js` pour identités/logements/catalogues ; `core.js` et `daily.js` pour simulation/transactions ; `household.js` pour habitants/revenus ; `housing.js` pour placement/migration ; `navigation.js` et `traffic.js` pour déplacements ; modules de rendu et d’interface pour le monde et les commandes. Aucun paquet à installer pour jouer ou exécuter les tests Node.js.

## Limites actuelles

CSS Safari, tactile natif et FPS sur iPhone 16 restent à valider sur appareil. Le rendu est stylisé, les animations procédurales et les réponses de dialogue prédéfinies. Pas de simulation physique du tissu ni d’expressions faciales détaillées.

Les voitures circulent mais ne sont pas conduisibles. Les trois logements partagent un plan ; les meubles d’origine restent fixes. Seuls les cinq types supplémentaires se déplacent. Pas encore d’éditeur de murs/étages, de commerce géré par le joueur ou de loyer.

Le projet de bébé utilise un moment de couple habillé et un calendrier fictif. Deux enfants au maximum ; bambin après deux jours, enfant après quatre. L’âge choisi pour le joueur reste fixe ; enfants et aînés n’ont pas de corps dédiés. Pas de multijoueur, connexion de compte ni synchronisation entre appareils.
