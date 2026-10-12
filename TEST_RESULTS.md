# Vérifications — V8.0.2

Correctif depuis main `858af0db63f815771fdeba68bd782b634b881a88`, branche `develop/v8-2-naissance-visible`, 12 octobre 2026. Aucun fichier utilisateur ni sauvegarde privée inclus. Publication selon l’autorisation permanente.

**285 tests dans douze suites** : les 261 vérifications V8.0.1 conservées, puis 24 de cycle familial visible. Les anciens tests de naissance sont adaptés au choix explicite de l’accueil. Les scénarios vérifient l’échéance traversée en dormant ou par grand saut de temps, un seul message, menus/activités non interrompus, choix différé et rappel, reprise des anciennes grossesses, prénom et coût nul, annulation et rechargement sans enfant fantôme, annonce après naissance unique, fermeture avant lecture, anciens enfants révélés sans modification, accès aux soins, rejet avant échéance et après naissance, identité du porteur et génétique avec un second adulte, copie du dialogue et historique sauvegardé.

Le scénario synthétique `birth-arrival` exécute l’interface de prénom et la transition sur le jeu réel, puis rejoue ses commandes sous Mesa EGL/GLES : 111 dessins, zéro erreur de shader et de GL. Pose au lit inspectée. Ce rendu ne valide pas les modales CSS dans Safari ni les performances sur l’iPhone. Le DOM simulé vérifie les boutons, les textes et la pause du temps.

Syntaxe JS/CJS, identifiants HTML uniques, présence des fichiers et cache commun 8.0.2 pour 40 scripts vérifiés. Les dates des enfants anciens sont conservées ; le rappel de reprise évite d’inventer une nouvelle naissance. L’accueil reste une transition de jeu, sans simulation médicale détaillée.

# Vérifications — V8.0.1

Correctif préparé depuis main `61f9d903cbeed0ecb940acbea727331b9148ea5a`, branche `develop/v8-1-grossesse`. Aucun fichier utilisateur ni sauvegarde privée inclus.

261 tests dans onze suites : les 256 tests V8 conservés et cinq tests de grossesse (valeurs invalides, remise à zéro entre personnages, aucune primitive détachée, matrices finies dans les seize tenues et trois poses, calendrier et sauvegarde inchangés). Shaders réels et poses de grossesse vérifiés sous EGL/GLES ; quatre scènes : grossesse de face, profil en marche, lecture assise en blouse/jupe, témoin sans grossesse. Zéro erreur de shader ou GL sous llvmpipe. Cache des 39 scripts passé à 8.0.1. Ce n’est pas une validation des performances ou du tactile sur Safari iPhone.

# Vérifications — V8.0.0

12 octobre 2026, branche `develop/v8-quotidien-vivant`, depuis la V7 publiée `6f15898dce0d7bca8876472831e768e065a17c43`. Publication selon l’autorisation permanente de la propriétaire conservée dans README. Aucune sauvegarde privée incluse.

**256 tests dans dix suites** : simulation 73, économie 7, quartier 28, révision 15, foyer 20, refonte 12, immersion 12, vie familiale 26, aménagement 24, quotidien vivant 39. Syntaxe JS/CJS, cache 8.0.0, 39 scripts locaux, identifiants HTML uniques et manifeste vérifiés. Les anciens scénarios restent actifs ; tests de catalogue actualisés à seize tenues, de durée de cuisine adaptés à vingt secondes, de position assise adaptés au bord réel de l’assise. Les essais de gestionnaires exécutent le jeu sous DOM/WebGL simulés, pas un téléphone.

Nouveaux essais : trajet de conversation sans téléportation et toujours valide ; quatre tours de parole, directions opposées, absence de prise des commandes, gain unique après huit secondes, délai enregistré, interruption par déplacement même très faible, refus, téléphone ou chargement. Poursuivre permet immédiatement la discussion choisie. Travail, rendez-vous, besoins urgents et sommeil prioritaires. Routines de lecture/téléphone/jardin/TV réellement sélectionnées. Repas rejoint avec consommation unique de deux portions, annulation gratuite, manque de nourriture, départ du participant et désactivation ; deuxième personne à la télévision et en lecture ; table déplacée conservant le point et la direction ; autre adulte jouable sans mariage automatique. Cuisine autonome en quatre étapes, provision consommée et message enregistré. Parent marchant au berceau avant le soin, éloignement et provisions contrôlés. Reprise dans un contexte neuf, réglages de l’ancien foyer en pause réactivables, compteurs bornés, scènes inachevées sans débit/gain fantôme. Maillages des nouveaux habits valides pour les deux corps, indices/poids/joints vérifiés, portés en marche/repos/repas/sommeil et conservés lors de changement de membre. Cadre portrait des deux personnes, caméra sauvegardée inchangée, lit double à deux places, canapé pour le troisième adulte et couple du principal préservé.

Défauts corrigés durant ces essais : invitation recréée pendant la conversation ; personnage forcé vers son interlocuteur sous une faible commande de marche ; invitation empêchant le parent d’atteindre l’enfant ; ancien rayon de soins excluant le berceau ; nourriture partagée créditée après départ ; cooldown bloquant Poursuivre ; manches procédurales déformant les épaules ; sommets répétés dans les nouveaux habits ; jambes cachées dans le canapé ; un interlocuteur hors du cadre ; couple couché à la même position ; relation amoureuse indue du membre secondaire.

**Dix-sept scènes** exécutées en Mesa EGL/OpenGL ES sans erreur de shader ou GL : blouse féminine, T-shirt masculin en marche, chemise féminine/téléphone, chemise masculine/cuisine, pyjama masculin/sommeil, T-shirt féminin/lecture, échange spontané, repas rejoint, lecture côte à côte, TV côte à côte, soin près du berceau, cuisine autonome, couple au lit, canapé déplacé/lecture, quartier en paysage et portraits masculin/féminin. Images inspectées pour positions, cadrage et vêtements. Ce replay traite les commandes GPU du jeu ; il ne rend pas son interface CSS. Une tentative dans le navigateur cloud Chrome sur la version publiée V7 a affiché WebGL indisponible ; ce navigateur n’a pas permis un test de jeu et ne représente pas Safari sur iPhone.

Statique inchangée depuis V7 : **1 592 objets / 496 lots / 506 856 sommets**. Les nouveaux hauts compacts contiennent **1 081 à 1 573 sommets** selon le corps et le vêtement (avant regroupement, 5 660 à 8 638), avec le même rendu des triangles quantifiés ; chaussons 196 sommets par modèle. Regroupement au chargement, buffers réutilisés pendant le jeu ; routes recalculées au changement de destination. Aucun FPS, consommation batterie ni temps de chargement mesuré sur iPhone.

Limites : graphismes et mouvements stylisés, dialogues prédéfinis et non vocaux, routines choisies selon l’heure plutôt qu’une intelligence conversationnelle. La cuisine et les soins restent des simulations simples. Pas de nouvelle refonte de grossesse/naissance, de corps d’enfants dédiés, de ville supplémentaire, conduite ou multijoueur. Mécaniques de couple/famille attachées au principal ; second adulte non romantique par défaut. Réorganisation V7 conservée avec équipements fixes. Aucun test natif Safari, orientation iOS, tactile ou batterie effectué.

---

# Vérifications — V7.0.0

12 octobre 2026, branche `develop/v7-amenagement`, depuis la V6 publiée `305dcc2b85544357754bbd2a368009cdc79093dc`. Publication couverte par l’autorisation permanente de la propriétaire, conservée dans README.

**217 tests dans neuf suites** : simulation 73, économie 7, quartier 28, révision 15, foyer 20, refonte 12, immersion 12, vie familiale 26, aménagement 24. Syntaxe JS/CJS, identifiants HTML uniques, 38 scripts locaux, cache 7.0.0 et manifeste contrôlés. Les gestionnaires du jeu s’exécutent sous un DOM et WebGL simulés ; ces tests ne constituent pas un test tactile Safari.

Nouvelles vérifications : menu Logement et inventaire, vrai clic sur le plan, flèches et rotation, annulation gratuite, validation gratuite avec enregistrement, refus de collisions/personnes/placements bloqués, trois plans initiaux praticables, intérieur entièrement réorganisé, collisions déplacées, transformation du rendu cohérente avec celle de la pose. Sommeil, lecture, repas à deux avec deux portions réellement consommées, télévision à deux, destinations de sommeil et repas du partenaire. Reprise dans un nouveau contexte à partir de la sauvegarde, coordonnées conservées à un emplacement auparavant occupé, aménagement distinct par maison, déménagement aller-retour, données corrompues, mobilier acheté conservé lors du retour au plan initial et compatibilité de son ancien éditeur.

Huit scènes capturées depuis les commandes du jeu puis exécutées en Mesa EGL/OpenGL ES : intérieur réorganisé, sommeil, lecture, repas à deux, canapé à deux, maison Roseraie, cuisine observée, quartier en paysage. Aucun échec de shader ni erreur GL. Inspection d’images : lit et table à leurs nouvelles places, personnage reposant au-dessus du matelas, lecture et couple sur le canapé tourné. La hauteur de sommeil et les coussins ont été corrigés pendant cette inspection. Aucun rendu CSS/interface native iOS annoncé.

Statique avant filtrage : **1 592 objets, 496 lots, 506 856 sommets**, contre 1 568 / 496 / 501 672 en V6 (environ +1 % de sommets, notamment pieds de chaises). Déplacements dessinés depuis les buffers existants. Les trois petits lots d’ombres de mobilier sont reconstruits uniquement si l’aménagement change, puis réutilisés ; les anciens buffers sont libérés. Vérification de navigation lors d’un changement dans le plan, pas à chaque frame. Ces mesures ne donnent pas les FPS d’un iPhone.

Limites : murs/étages non éditables ; cuisine, douche, télévision, table basse et luminaires fixes, donc choisir l’orientation du canapé en fonction du téléviseur. Modèles stylisés et poses simplifiées, sans tissu/cheveux physiques. Trois logements, deux adultes jouables et mécaniques familiales de la V6 conservés. Pas de conduite, multijoueur ni synchronisation distante. Aucun test natif iPhone/Safari, batterie, vitesse du plan tactile ou FPS effectué.

---

# Vérifications — V6.0.0

Développement du 12 octobre 2026 sur `develop/v6-vie-de-foyer`, à partir de la V5 publiée `03789f851837e95da7e80ebaa9625474b685a439`. Publication V6 et mises à jour suivantes autorisées par la propriétaire le 12 octobre 2026, sans nouvelle confirmation. Le code testé reste inchangé ; seuls les documents de publication ont été actualisés.

**193 tests** dans huit suites : simulation 73, économie 7, quartier 28, révision 15, foyer 20, refonte 12, immersion 12, vie familiale 26. Tests de version/catalogue actualisés pour les 35 scripts, dix coiffures et douze tenues ; les anciennes vérifications de déplacements, animation, transactions, collisions et sauvegardes restent actives. Syntaxe JS/CJS, identifiants HTML uniques, cache 6.0.0 et manifeste autonome vérifiés.

Les nouveaux tests exécutent les vrais gestionnaires et routines : approche spontanée sans téléportation, refus et délai enregistré, absence d’interruption au travail ou avec des besoins urgents, dîner à deux avec débit de deux portions une seule fois, annulation gratuite, besoins des deux participants, soirée télévisée, deux identités jouables et retour au foyer. Cloisons réellement solides, accès cuisine/chambre/salle de bain/nurserie/jardin, paiement unique du déménagement, transfert des adultes et conservation d’un meuble incompatible dans l’inventaire. Poussette réellement achetée, présence/soins du bébé pendant la sortie, retour requis à domicile, sortie enregistrée, arrêt lorsque le bébé grandit, poignées accessibles aux deux squelettes. Deux enfants voisins empruntent leurs trajets avec collisions ; enfant du foyer allant au lit ; nouvelle coiffure héritée/restaurée. Un **nouveau contexte du jeu initialisé à partir du stockage**, et pas seulement restoreGame, vérifie la reprise des paramètres RP et de la promenade.

Défauts corrigés pendant les vérifications : crâne débordant d’une coiffure ellipsoïde sous certains angles, vêtement traversé par le pantalon au dos, compagnon ne proposant jamais une rencontre, état RP perdu à l’initialisation d’une page neuve, cadrage portrait coupant les deux convives, écran TV masquant le couple, collision manquante du meuble TV, poignées trop loin de la portée des bras, coiffure de l’enfant tronquée après chargement. Les modèles humains restent stylisés.

Treize scènes distinctes exécutées en Mesa EGL/OpenGL ES : portrait féminin de face, coupe courte de profil, marche féminine vue de dos, veste masculine, tunique de profil, sweat masculin, maison familiale, dîner à deux, canapé à deux, poussette avec bébé, famille voisine, quartier en paysage (852 × 393) et enfant au lit la nuit. Aucun échec de compilation de shader ni erreur GL sur les scènes exécutées. Ce replay utilise les commandes du jeu ; **ce n’est pas Safari**, ni un rendu de l’interface HTML/CSS.

Géométrie statique avant filtrage : **1 568 objets / 496 lots / 501 672 sommets**, contre 1 533 / 457 / 492 060 en V5, environ +2 % en sommets. Les coiffures ont désormais 3 412 à 5 716 sommets par mesh selon la coupe ; plusieurs coiffures sont donc plus détaillées que celles de V5. Filtrage et regroupement existants conservés. Ces mesures ne sont pas des FPS. Le mode Économie reste disponible.

Limites : pas de validation native iPhone/Safari des contrôles, du CSS, de l’ouverture autonome, de la rotation, de la batterie ou des FPS. Dialogues prédéfinis, invitations à accepter/refuser ; personnages et enfants stylisés ; deux enfants voisins prédéfinis dont les positions ne sont pas sauvegardées. Poussette attachée visuellement au déplacement, sans physique de véhicule. Trois logements de même emprise ; un intérieur familial avec cloisons et lits, pas une grande ville nouvellement reconstruite. Deux adultes contrôlables ; couple/grossesse du personnage principal ; murs et mobilier initial fixes. Le manifeste ne fournit pas de cache hors ligne et ne force pas l’orientation du système.

---

# Vérifications — V5.0.0

Vérifications locales du 11 octobre 2026 sur `develop/v5-immersion`, à partir du commit V4 publié `a444eef118225759d9f943e0f42caa088dae6aeb`. Contrôles GitHub réussis sur le code V5 `b0b16cd96fed6ef93b086759a0aadf1e049abd7e`. Publication V5 autorisée par la propriétaire le 12 octobre 2026 ; seuls ces documents ont été actualisés après les tests, sans modification du code validé.

**167 tests** dans sept suites : simulation 73, économie 7, quartier 28, révision 15, foyer 20, refonte 12, immersion 12. Syntaxe JS/CJS, cache 5.0.0, 32 scripts locaux et identifiants HTML uniques vérifiés. Sept suites inscrites au workflow GitHub sans déploiement.

Nouveaux tests : cycle lumineux fini/borné sur 72 heures, répétition à minuit, variations jour/crépuscule/nuit et studio indépendant de l’heure ; lumière des lampes sur les personnages ; géométrie/matières bornées ; indices et poids des cols/tabliers ; vraie activité observée/rotation et préservation de position, provisions et réglages caméra ; annulation/fin/import et transaction unique ; isolement du studio ; placement des postes et séparation des collègues ; looks restaurés après export ; alertes de besoins ; vrais gestionnaires de glissement et zoom en vue d’activité, puis retour à la caméra normale.

Inspection graphique hors navigateur : 14 scènes distinctes capturées depuis les commandes réelles du jeu et rejouées en Mesa EGL/OpenGL ES. Quartier en journée/crépuscule/nuit, maison Roseraie, lecture et discussion en vue d’activité, studio réel, portraits féminin de face/masculin de profil, robe en marche vue de dos, cardigan en lecture de profil, mobilier et cuisine/travail observés. Le rendu teste la compilation des programmes et les commandes GPU, pas les performances d’un iPhone. Personnages et parties synthétiques uniquement.

Défauts corrigés pendant l’inspection : implantation et grosses mèches latérales, motifs de matière trop contrastés, cadrage derrière le réfrigérateur, rayons d’occultation trop étroits, placement au travail trop loin du comptoir, bandes fines de parquet scintillantes, nuit trop sombre et précision différente d’un uniforme partagé entre shaders. Les ombres ajoutées sont des ombres de contact stylisées, pas un moteur d’ombres en temps réel.

Géométrie statique avant filtrage : environ **1 533 objets / 457 lots / 492 060 sommets**, contre 1 381 / 414 / 399 648 en V4. Frustum, filtrage des maisons éloignées et regroupement par matériau conservés ; ciel en un dessin et ombres de contact en trois dessins. Le coût en sommets a augmenté d’environ 23 %. Ces valeurs ne sont pas des FPS. Aucun test natif Safari, CSS, tactile ou batterie effectué ; la qualité Économie reste disponible.

Limites : même base humaine CC0 ; rendu stylisé, sans cheveux/tissu physiques, doigts articulés, vraie réflexion du miroir ou ombres projetées ; pas de nouvelle ville ni conduite ; deux adultes contrôlables ; couple/grossesse toujours rattachés au personnage principal ; meubles initiaux fixes. Les commandes CSS portrait/paysage et le confort de la V5 doivent être vérifiés sur appareil après publication autorisée.

---

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
