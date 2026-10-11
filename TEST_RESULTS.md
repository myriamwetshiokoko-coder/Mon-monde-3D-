# Vérifications — V4.0.0

Vérifications locales du 11 octobre 2026, branche `develop/refonte-personnages`. Publication V4 autorisée par la propriétaire le 11 octobre 2026 ; code validé inchangé depuis les tests.

**155 tests passent** : simulation 73, économie 7, quartier 28, révision 15, foyer partagé 20, refonte 12. Les six suites sont intégrées au workflow GitHub, sans déploiement. Syntaxe JS/CJS, identifiants HTML uniques, 28 scripts locaux et cache 4.0.0 uniforme ; diff propre.

Nouveaux tests : migration neutre et valeurs corrompues bornées ; visage/tenues conservés après changement de membre et export ; clignement/parole ; conservation de la longueur des bras et limite de portée, cas de cible confondue avec l’épaule ; mains réelles du squelette masculin/féminin sur 12 gestes et quatre phases ; cuillère vers le visage ; géométrie/poids de la robe et rendu des deux tenues ; vrais boutons de rotation/gros plan/poses du studio avec partie figée ; horloge séparée et orientation initiale du studio ; sliders et reprise ; achat/rotation/rendu/reprise des trois nouveaux meubles ; quatre gestes de cuisine et protection d’une double fin d’activité.

Inspection hors navigateur : 15 cas distincts EGL/GLES (face/dos robe en marche, profil cardigan avec lecture, repas, cuisine, deux gros plans, conversation du foyer, ameublement, maison Sauge, studio isolé, nouveaux meubles, préparation/découpe/mélange). Deux vues ont été rejouées après correction des cheveux traversant le dos et de la peau traversant la manche. Aucun échec de shader ni erreur GL sur les rendus exécutés. Les images ont été inspectées sous plusieurs angles ; aucun fichier privé utilisé. L’outil de replay gère maintenant aussi les uniformes vec4.

Les vues de travail ont permis de corriger des cibles hors de portée, le cas analytique où la cible coïncidait avec l’épaule, la face initiale du studio, le gel de ses animations en pause et un appel de fin d’activité déjà terminée. Tests de régression ajoutés.

La base testée contient environ 1 381 objets, 414 lots statiques et 399 648 sommets avant filtrage, contre 1 120 / 363 / 359 940 en V2.5. Les décorations utilisent les lots statiques existants ; traits/accessoires de visage seulement dans un rayon de huit mètres. Les bras utilisent une solution analytique, pas une recherche itérative par image. Ces chiffres ne mesurent pas les FPS et ne garantissent pas la fluidité sur iPhone.

À vérifier sur appareil : studio portrait/paysage, glissement et commandes de rotation, gros plan, sliders, tenues sur les deux corps, reprise de deux adultes avec visages distincts, cuisine et repas, nouveaux meubles, circulation et confort des trois résolutions. Aucun contrôle natif Safari, CSS ou tactile mesuré par les tests simulés.

Limites : même base de modèles humains CC0, style encore stylisé ; pas de doigts articulés, tissu physique ou expressions complètes ; meubles d’origine fixes, pas d’éditeur de murs ; couple et grossesse attachés au principal, deux adultes contrôlables ; aucune conduite ou nouvelle ville dans cette révision. Les anciens systèmes restent jouables.

---

# Vérifications — V3.0.0

Vérifications locales effectuées le 11 octobre 2026 sur `develop/v3-foyer`. Publication V3 autorisée par la propriétaire le 11 octobre 2026. Les vérifications GitHub du code validé ont également réussi.

| Suite | Réussis |
| --- | ---: |
| Simulation/intégration | 73 |
| Métiers/économie | 7 |
| Quartier/foyer | 28 |
| Révision V2.5 | 15 |
| Foyer jouable V3 | 20 |
| **Total** | **143** |

Les cinq suites passent. Syntaxe de tous les fichiers JS/CJS et `git diff --check` valides. Le workflow GitHub inclut les cinq suites et ne déploie rien.

Les 20 nouveaux tests couvrent : anciennes parties/familles conservées, création sans remise à zéro, identités personnelles distinctes, budget/horloge/meubles communs sans duplication, export/import, données corrompues bornées, limites adultes/service, salaire autonome unique, grossesse attachée au personnage principal, absence de corps dupliqué après plusieurs reprises, vraie personnalisation, activité en cours et quota de stockage, cuisine/repas autonomes, conversation, isolation des histoires, routes réelles du travail et reprise sans double salaire, téléphone/rendez-vous/délai de conversation persistants, naissance avec la bonne identité familiale et contrôle d’âge réel.

Rendu supplémentaire `foyer` : scène réelle d’une conversation entre le personnage principal et le nouvel adulte, 109 appels de dessin rejoués dans EGL/OpenGL ES Mesa. Zéro erreur de shader et GL ; image inspectée : personnages distincts, espacés et face à face. Ce contrôle ne mesure pas Safari, la disposition CSS, les gestes tactiles ou les FPS sur iPhone 16.

Recette sur appareil après accord de publication : ouvrir **Mon foyer jouable**, créer/personnaliser le second adulte, changer plusieurs fois de contrôle, vérifier besoins/tenues et compte commun ; lui choisir un métier puis contrôler l’autre et laisser les menus fermés ; observer son départ/service/salaire/retour ; vérifier les repas puis fermer et reprendre Safari ; exporter le foyer. Tester portrait/paysage et confort du HUD plus rempli.

Limites connues : deux adultes contrôlables ; famille romantique du personnage principal seulement ; enfants et conjoint historique non contrôlables ; routines simplifiées, téléphone partagé ; graphismes V2.5 conservés, voitures non conduisibles et meubles d’origine fixes. Aucun fichier privé, enregistrement ou sauvegarde de la propriétaire inclus.

---

# Vérifications — V2.5.0

Préparée et validée le 10 octobre 2026 sur `develop/v2.5`. Publication autorisée par la propriétaire le même jour.

## Vérifications de cette révision

- 73 tests de simulation, 7 métiers/économie, 28 quartier/foyer et **15 tests V2.5 : 123 tests**.
- Nouveaux parcours : migration en première partie, six parties sans partage de données, changement de personnage, erreur de stockage sans remplacement, fin du rendez-vous après discussion, invitation conservée après annulation, projet de famille et test différé, porteur valide, annulation gratuite, cuisine en quatre étapes, choix au travail, géométrie des coiffures, finitions des meubles persistantes.
- Les tests existants des menus ont été adaptés au nouveau nombre de commandes et aux décisions au travail. Le parcours de famille vérifie maintenant le projet puis la confirmation au lendemain, au lieu d’exiger une grossesse immédiate.
- Rendus réels EGL/OpenGL ES contrôlés : femme en marche avec cheveux ondulés, carré avec lecture, tresses relevées en marche, homme en polo, intérieur aménagé. Zéro erreur de shader ou GL. Vérification hors navigateur ; aucun FPS Safari ni contrôle tactile natif mesuré.
- La vérification automatique GitHub inclut la quatrième suite V2.5 et ne déploie rien.

## À contrôler sur l’iPhone

Boutons Sauver/Personnages en portrait et paysage, confort des nouvelles coiffures, annulation du moment privé, reprise de plusieurs parties après fermeture, préparation des repas et décisions au travail. Ne pas effacer les données Safari : elles contiennent les sauvegardes locales.

## Résultats détaillés de la base V2.4


Tests exécutés le 10 octobre 2026 sur la branche de développement, avec Node.js 24.19.0. **Publication V2.4 autorisée par la propriétaire le 10 octobre 2026. Les résultats ci-dessous concernent le code validé avant publication.**

## Résultats

| Suite | Résultat | Portée |
| --- | --- | --- |
| `node tests/simulation.test.cjs` | 73 réussis | Fonctions existantes, scripts/gestionnaires DOM, besoins, profils, relations, enfants, gestes, collisions, trajets, sauvegardes |
| `node tests/daily.test.cjs` | 7 réussis | Achats atomiques, compte, salaires, horaires, métiers, progression, livres, téléphone |
| `node tests/neighbourhood.test.cjs` | 28 réussis | Conversations, conception, huit habitants, autonomie/revenus, logements, meubles, circulation |
| Syntaxe Node.js | 24 fichiers JS/CJS valides | Sources, tests, outil de capture |
| Structure HTML | 107 identifiants uniques ; 20 scripts + 1 style locaux | Balises structurelles équilibrées, chemins existants, cache `2.4.0` uniforme |
| `git diff --check` | Aucune erreur | Espaces et conflits de patch |

Total : **108 tests**. DOM et appels WebGL simulés dans les suites d’intégration ; ce résultat ne constitue pas une recette dans Safari.

## Parcours contrôlés

- Discussion depuis quatre orientations et depuis une position superposée : faces orientées l’une vers l’autre, distance suffisante, joueur dans une position valide, annulation sans progression. Cadrage des deux personnes. Axe avant +Z des modèles/coiffures cohérent avec la marche dans quatre directions.
- Projet de bébé refusé hors domicile, sans partenaire proche, sans porteur éligible ou avec un choix incohérent, sans dépense. Vrai bouton de rendez-vous, arrivée du partenaire à pied, activation de la conception, choix du porteur, paiement à la fin, sauvegarde et naissance après trois jours. Adoption pour un foyer masculin. Anciennes grossesses, enfants et relations conservés.
- Les sept habitants employés terminent chacun quatre postes et la fin de service avec les routes réelles. Aucune progression à distance. Sauvegarde/reprise du temps de tâche, rémunération une seule fois par jour. Seul le conjoint cohabitant contribue au compte du joueur. Les deux salaires s’additionnent sans crédit lors des jours sautés ou d’une absence.
- Conjoint : cuisine consommant une provision/créant deux repas, repas consommé/refaisant la faim, toilette et sommeil refaisant leurs besoins. Discussions spontanées face à face, sans interruption des repas, du sommeil ou du travail.
- Accès aux trois maisons et aux pièces par des routes valides, portes indépendantes. Déménagement annulé sans dépense, achat au prix prévu, refus pendant le service du joueur, retour gratuit dans un logement acquis. Enfants, objets, rendez-vous et activités restent au bon logement après reprise.
- Meubles : aucune dépense avant confirmation, chevauchements et passages refusés, trajets domestiques conservés, rotation du volume de collision, déplacement gratuit, rangement et identité sauvegardée. Un meuble valide près du joueur ne se range plus au rechargement. Une personne à son emplacement bloque l’installation. Lecture au bureau : pose visible et compteur incrémenté à la fin.
- Circulation : freinage puis reprise, collision d’une voiture arrêtée, habitant traversant le trafic sans chevauchement ni blocage permanent, reprise sur la route avec voitures à distance. L’arrière-plan gèle la simulation.
- Six styles/cinq coiffures sauvegardés sur les deux corps, indices/poids/normales valides des manches longues et nouvelles coiffures, déformation des manches avec les bras, poses finies.
- Objets hors caméra : rejet derrière la caméra, conservation dans le champ et sur le plan proche, bornes finies. Une vue synthétique ciblée garde 103 des 363 lots statiques avant les autres filtres.

La grille indépendante de 40 cm trouve 16 878 positions atteignables et vérifie l’accès aux objets du quartier. La recherche du jeu utilise une grille distincte de 50 cm et une arrivée précise lorsque le dernier segment est libre.

## Corrections issues des essais

Une arrivée au rayon pouvait choisir le mauvais voisin de grille et arrêter Noah/Inès trop loin pour travailler. La sélection de la case la plus proche, l’arrivée précise et l’espacement parallèle au rayon corrigent ce blocage. Le test suit leurs services entiers et vérifie les salaires.

Un piéton pouvait entrer dans une voiture qui venait de s’arrêter. Les déplacements des habitants/enfants utilisent désormais son volume et recalculent un trajet après un blocage. La reprise d’une sauvegarde sur une voiture initialement au même endroit est protégée par le placement du trafic à distance.

La restauration d’un meuble pouvait le ranger lorsque le joueur se tenait juste à côté ; les installations valides sont conservées. Les rendez-vous domestiques suivent le déménagement. Une position ancienne invalide rejoint l’entrée du logement actuel.

Le cadrage centré sur le joueur pouvait couper son interlocuteur en portrait. Le duo sert de cible. Le rendu en coupe retire montants/porte intérieure et la transparence protège aussi le partenaire et le bouquet d’entrée.

## Rendu réel hors navigateur

`tools/capture_render.cjs` charge les scripts avec des parties synthétiques et enregistre buffers, shaders, matrices, couleurs et commandes. `tools/check_render.py` les rejoue dans un vrai contexte EGL/OpenGL ES Mesa/llvmpipe. Aucun navigateur ou serveur n’est utilisé.

```sh
node tools/capture_render.cjs /tmp/frame.json conversation
python tools/check_render.py /tmp/frame.json /tmp/frame.png
```

Quatorze cas distincts : conversation dans la rue, conversation du foyer avec grossesse, maisons Sauge/Roseraie (nuit), rue de jour, café avec repas, travail au café, meubles placés, homme en polo marchant, femme en pull lisant avec queue de cheval, homme en sport arrosant avec cheveux bouclés, femme en jupe assise, homme au repos et homme en pull.

**Aucune erreur de compilation/liaison des shaders ni erreur GL sur les cas exécutés.** Les images sont inspectées pour orientation, vêtements/coiffures, cadrage, accessoires, sièges et occultations. Conversation et famille sont rejouées après les corrections de cadrage et de porte.

Décor final : 1 120 objets, 363 lots statiques, 359 940 sommets avant filtrage. Le fichier local des modèles humains, inchangé depuis V2.3.2, mesure 1 009 230 octets. Vêtements, nouvelles coiffures et voitures générés une fois/partagés. Filtrage par champ de vision/distance. Ces nombres ne mesurent pas des FPS.

Ce contrôle ne valide **ni CSS et HUD réel, ni Safari/WebKit, ni gestes tactiles natifs, ni FPS sur iPhone 16**. Aucun enregistrement, capture ou sauvegarde de la propriétaire n’est inclus dans le dépôt.

## Vérifications automatiques

`.github/workflows/validate.yml` exécute syntaxe et cinq suites Node.js sur `main`, `develop/**` et les pull requests. Actions officielles fixées à leurs commits vérifiés, accès au dépôt en lecture. Aucune étape de déploiement.

## Recette restante sur iPhone

1. Reprendre la partie : monnaie, foyer, apparence. Joystick, course, arrêt, caméra, pincement, portrait/paysage et arrière-plan.
2. Observer les deux corps et six tenues en marche ; parler au café/domicile, contrôler visages, sièges, cadrage et étiquettes.
3. Choisir un métier, suivre quatre postes, annuler/reprendre, recharger au milieu du service, contrôler salaire/historique.
4. Observer le travail/salaire du conjoint puis son retour/repas. Fermer les menus pour laisser ses trajets avancer.
5. Rendez-vous à la maison, attendre le partenaire, choisir le porteur, annuler puis terminer le projet, recharger et poursuivre jusqu’à la naissance.
6. Visiter, déménager, vérifier enfants/meubles. Placer, tourner, déplacer, ranger et réinstaller un meuble ; lire ou arroser.
7. Traverser la rue, observer le trafic, essayer les trois résolutions et contrôler la fluidité des zones remplies.

Conduite, éditeur de murs, multijoueur et expressions faciales détaillées restent hors de cette version et ne sont pas annoncés comme implémentés.
