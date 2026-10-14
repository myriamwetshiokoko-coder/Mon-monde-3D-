## V12.2.0 — intérieurs, 14 octobre 2026

- Les 21 suites Node passent. Six nouveaux tests contrôlent la géométrie, les indices et tangentes, la taille mémoire, les positions dans les cinq logements, la persistance d’un aménagement valide et de l’argent/thème, l’absence de nouvelles allocations GPU pendant les dessins, le passage transparent différé du frigo, le repli si un shader est refusé et la coupe des meubles hauts dans la vue de cuisine.
- Les 24 tests d’aménagement conservent repas, sommeil, rotation, placements, trajets et migration. La simulation conserve 73 tests. Le test de cache vérifie les 55 scripts en V12.2.0.
- Les scènes réelles sont capturées et rejouées par EGL/GLES Mesa llvmpipe avec textures et indices : `bedroom`, `interior-detail:bed`, `interior-detail:dining`, `interior-detail:kitchen`, `interior-detail:fridge`, `focus-cook`, `shared-dinner`, `arranged-sleep`. Zéro erreur de shader/GL ; images inspectées. La vue de cuisine a révélé une obstruction par les meubles hauts : elle est corrigée et rendue à nouveau.
- Syntaxe JS/CJS et Python vérifiée ; `git diff --check`.
- Les tests de simulation utilisent un DOM/WebGL simulé. Le rendu EGL est réel, mais ne constitue pas une validation de Safari, CSS, tactile ou FPS sur iPhone 16. Aucune sauvegarde personnelle publiée.

Reproduire : `node tests/interiors-v12.test.cjs`; `node tools/capture_render.cjs /tmp/cuisine.json focus-cook`; `python3 tools/check_render.py /tmp/cuisine.json /tmp/cuisine.png`.

## V12.1.0 — Aurore, 14 octobre 2026

- Toutes les suites Node du projet sont exécutées, y compris `tests/furniture-aurore.test.cjs` (3 tests). Le test de cache/version de simulation est actualisé pour les deux nouveaux scripts et V12.1.0.
- Géométrie : 9 750 sommets / 15 792 triangles. Six groupes de matériaux ; indices uint16 valides, normales et tangentes orthonormales, UV finis. Géométrie et tuiles décodées sous 650 000 octets, partagées entre logements.
- Encombrement vérifié contre les collisions existantes pour les quatre rotations et les cinq logements. Aménagement valide sauvegardé/repris avec argent et thème inchangés. Ancien canapé disponible comme repli à distance.
- Shaders réels compilés et commandes GPU rejouées dans EGL/GLES Mesa llvmpipe : `aurore-detail` (7 dessins), `aurore` (142), `aurore-night` (249), `aurore-moved` (253), `focus-read` (234). Zéro erreur de shader ou de GL ; les images sont inspectées. Textures, mipmaps et indices sont exécutés par ce relecteur, sans mock du rendu.
- Vérification de syntaxe de tous les scripts JS/CJS et des deux scripts Python concernés ; `git diff --check`.
- Les tests de simulation utilisent DOM/WebGL simulés ; les rendus EGL ne vérifient ni le navigateur, ni l’interface CSS/tactile native, ni les FPS de l’iPhone 16. Pas de test Safari natif revendiqué.

Reproduction : `node tests/furniture-aurore.test.cjs`; `node tools/capture_render.cjs /tmp/aurore.json aurore-detail`; `python3 tools/check_render.py /tmp/aurore.json /tmp/aurore.png`. Aucun fichier personnel utilisé pour ces scènes synthétiques.

# Vérifications — V12.0.1

Correctif depuis V12 main `98bcb4b091df9064b75479b46c412a8ebafce1b6`, branche `develop/v12-1-permis-accessible`. Neuf nouveaux tests d’intégration : accès avant inscription, guide autour du véhicule et arrivée à portée, rendu du véhicule avant le code sans transaction, inscription/questions via vrais boutons, départ désactivé à distance, parcours réel et attribution finale, interaction du véhicule acheté et permis exigé, accès carte/distances et guide transitoire non sauvegardé, annulation sans permis fictif. La sortie après examen reste hors de la collision de la voiture stationnée.

Régressions ciblées : ville/école, simulation complète et V12. Le placement du véhicule a révélé un chemin d’enfants passant à travers sa collision ; la planification des itinéraires inclut maintenant ce véhicule stationné. Rendu du départ avec vraie voiture avant inscription sous Mesa/EGL : aucune erreur shader/GL. La CI exécute les dix-neuf suites (397 tests). Vérification des fichiers publiés avant remise du lien. Limites : DOM simulé et GPU llvmpipe, FPS/tactile Safari iPhone non mesurés ; conduite assistée.

# Vérifications — V12.0.0

Développement sur `develop/v12-refonte-visuelle`, depuis main V11 `71558ae2975e6a3331419ad6ea9ff4ebb41d1454`, 13 octobre 2026. Publication selon l'autorisation permanente de la propriétaire. Aucune sauvegarde ni capture personnelle incluse.

**388 tests dans dix-huit suites.** Quatorze nouveaux contrôles couvrent les sept métiers par les vrais boutons (démarrage, quatre décisions et salaire une seule fois), lieux et postes accessibles sans traverser les murs, sauvegarde/restauration des aménagements des deux appartements, poids et indices des coiffures, tailles/repères des huit bases, meubles toujours déplaçables, quatre nouvelles carrières des cohabitants et parois conservées selon la position de la caméra. Les tests existants restent actifs. Leurs attentes de version, de nombre de sommets et d'opacité sont adaptées au nouveau rendu. Le budget de lots statiques est plafonné à 1 000 et le budget de géométrie reste sous 850 000 sommets ; l'éclairage intérieur de jour est désormais contrôlé avec son rebond supplémentaire de 0,12.

**35 scènes GLES, sept scènes complémentaires et gros plans de correction.** Vrais shaders et commandes sous Mesa/EGL : visages de face/profil, plusieurs coiffures, marche/course, enfants/aînés/bébé, repas, lecture, téléphone, grossesse, cuisine, famille, appartements. Les compléments démarrent les tâches de chef, enseignant, mécanicien et soignant par les vrais menus avant leur rendu ; ils incluent aussi rue, chambre et intérieur. Après retouche des boucles, compilation et rendu contrôlés à nouveau. Pas d'erreur shader ou GL dans les scènes validées.

**Contrôles statiques :** syntaxe de 71 JS/CJS, Python compilable, 52 scripts locaux sous cache 12.0.0, 140 IDs uniques et manifeste valide. 2 546 objets, 858 lots statiques, 745 236 sommets statiques. L'asset humain JavaScript pèse 2 133 991 octets. Les coiffures utilisent des sommets partagés pour supprimer leurs doublons ; aucun nouveau maillage GPU n'est créé pendant une animation.

**Limites :** DOM et actions tactiles simulés, GLES sur llvmpipe ; aucune mesure de FPS natifs sur iPhone 16 ni validation CSS Safari annoncée. Le navigateur de contrôle disponible ne fournit pas de contexte WebGL. Le résultat reste stylisé, avec vêtements procéduraux, doigts rigides et gestes simples. Étages des appartements décoratifs et conduite assistée comme dans V11. Les traits des visages et coiffures ne constituent pas une refonte photoréaliste comparable aux Sims 4 ou à One State.

# Vérifications — V11.0.0

Développement sur `develop/v11-vie-ville`, depuis la V10 publiée `052a7c345e3d3940c680e00fd196e4f0f811223b`. Publication autorisée sans nouvelle confirmation. Toutes les fixtures utilisent des personnages fictifs ; aucune vidéo privée ni sauvegarde personnelle ajoutée au dépôt.

**Validation : 374 tests, 17 suites.** Les 361 contrôles précédents sont conservés. Les fixtures d’âges utilisent désormais l’âge choisi pour les nouveaux bébés, et les contrôles de parc s’exécutent hors des services et du dîner. Les quantités de scripts/habitants, l’étendue et le budget de la géométrie sont adaptés à l’extension du quartier. Les tests de circulation restent stricts : aucun contact avec les véhicules. Les fixtures de trajet font avancer la circulation comme dans la boucle réelle du jeu. Les menus Ambiance, Rituels, Habitudes et Réorganiser restent accessibles.

Treize contrôles V11 : migration des anciennes tenues/familles/propriétés et comptes ; achats atomiques ; caution/loyers/dettes sans double prélèvement ; achat/revente/colocation sans romance imposée ; mode créatif et protection des âges adultes ; stabilité des nouveaux bébés ; école/présence/déjeuner une fois par jour ; sept carrières ; code et vrai parcours du permis ; achats/trajets/freinage/revente automobile ; nouveaux menus avec anciens accès maintenus ; cheminements vers appartements/école/atelier ; maillages d’âge et pivots finis.

**35 scènes GLES offscreen + contrôles finaux ciblés.** Compilation des shaders du jeu, vrais buffers et commandes de dessin via Mesa/EGL : aucune erreur shader ou GL. Inspection de face/profil, marche/course, jupes, repas, lecture, téléphone, sommeil, grossesse, rituels et foyer ; nouvelles morphologies enfant/aîné, bébé dans son lit, école occupée, conducteur et deux appartements. Position du conducteur et couleur des cheveux âgés corrigées après inspection.

**Contrôles statiques :** 50 scripts locaux sous cache 11.0.0, syntaxe de 68 JS/CJS, manifeste valide et 139 IDs HTML uniques. Géométrie statique : 665 640 sommets, bâtiments hors champ éliminés. Asset humain : 1 635 070 octets JS ; adultes 241 188 octets binaires chacun, six bases d’âge 122 188 octets chacune. Bases/coiffures d’âge créées sur GPU au premier usage, puis réutilisées. Les données d’animation ne sont pas ajoutées aux sauvegardes.

**Limites :** DOM/touch simulés, rendu GLES sur llvmpipe ; aucune mesure de FPS natifs iPhone 16 ou inspection CSS Safari. Morphologies encore semi-réalistes, doigts rigides et habits procéduraux. Appartements au rez-de-chaussée, niveaux supérieurs décoratifs. Conduite assistée avec parcours et arrêts réels, pas de volant libre ou physique automobile. École de quartier simple ; cycle de vieillissement explicite pour les nouveaux enfants.

# Vérifications — V10.0.0

Branche `develop/v10-personnages-naturels`, depuis main V9.0.1 `31338cd26b4203d6d4cfa36289c1130a76661b36`, 13 octobre 2026. Publication selon l’autorisation permanente de la propriétaire ; aucune sauvegarde ni capture personnelle ajoutée au dépôt.

**361 tests dans seize suites.** Les 345 essais précédents restent actifs ; les contrôles de quantité/matériaux sont adaptés aux nouvelles bases, aux yeux plus compacts et aux couleurs de sourcils intégrées. Le réglage de poitrine conserve ses valeurs enregistrées avec une nouvelle amplitude de rendu adaptée à l’anatomie de la base. Les comparaisons numériques de déformation tolèrent l’arrondi flottant.

Seize essais V10 couvrent provenance/budget des deux bases, yeux attachés à la tête, alternance et continuité des pieds, appui lié à la distance y compris avec un joystick partiellement incliné, course distincte, pieds plats au sol sous plusieurs tailles, conservation des longueurs de jambes, respiration au repos, transitions de 0,30 seconde, longueurs/os connectés pendant les transitions, séparation des caches par personne et remise à zéro, quatre nouveaux gestes de studio sans avancer la partie, clignement/expression et remise à zéro des uniformes, absence de nouveaux buffers GPU ou champs d’animation dans les sauvegardes, collier projeté sur les vrais vêtements avec leurs poids d’articulation.

**Rendu réel hors écran :** 26 scènes rejouées sous Mesa EGL/OpenGL ES après les corrections de boucles/volume, puis le profil du collier et sept contrôles finaux. Vues de face, profil et trois quarts, morphologies féminine/masculine, carré/tresses/boucles, lunettes, paupières fermées, marche/course, poitrine minimum/maximum, grossesse, repas/lecture/téléphone/sommeil, studio, enfants, conversation, dîner, TV, cuisine et promenade du couple. Les commandes et shaders du jeu sont exécutés en GLES ; les parties sont synthétiques. La comparaison des vues a permis de corriger les boucles sur le front, des fissures de subdivision des vêtements et les accessoires trop éloignés du nouveau corps.

**Contrôles statiques :** syntaxe JS/CJS et Python, poids/indices/normales des modèles et vêtements, 43 scripts locaux, cache 10.0.0, fichiers référencés, IDs HTML uniques, manifeste et différences sans erreurs d’espaces. Modèles : 7 098 sommets / 14 172 triangles par corps, 241 188 octets binaires chacun ; environ 647 ko pour l’asset JS. Les tissus ajoutent leurs propres triangles (environ 5 300–6 300 pour chemise/lin/maille/veste selon corps). Aucun buffer de personnage n’est créé pendant les animations.

**Limites de vérification :** Mesa/llvmpipe exécute le rendu mais ne représente pas le GPU de l’iPhone. Les tests d’interface emploient un DOM simulé et ne rendent pas le CSS natif. Aucune mesure de FPS, de tactile ou de comportement Safari sur iPhone 16 n’est annoncée. Expressions simples, pas de rig de doigts ni de capture de mouvements ; les enfants gardent des modèles réduits. Le jeu conserve son style semi-réaliste léger.

# Vérifications — V9.0.1

Correctif depuis main `4da4616d5a581f435e33bcca6445e493e5e2c903`, branche `develop/v9-1-visage-silhouette`, 13 octobre 2026. Publication selon l’autorisation permanente conservée dans README ; aucune photo personnelle ni sauvegarde privée incluse.

**345 tests dans quinze suites** : les 332 essais précédents, dont le contrôle des sourcils adapté au rendu intégré, et treize essais de fixation/apparence. Suppression des primitives de lèvres/sourcils vérifiée pour les deux corps, plusieurs poses et dimensions ; réglage de poitrine borné, import ancien, sauvegarde avec enfant/grossesse, deux adultes indépendants, affichage selon âge/morphologie, remise à zéro des uniformes entre personnages, deux chemins de rendu des enfants, expressions/maquillage propres à chaque visage. Indices, normales et poids des vêtements, col à moins de cinq millimètres des vrais triangles de la chemise raccord des épaules sous cinq poses, manches de veste adaptées au poignet de chaque corps et absence de nouvelle allocation de maillage pendant l’animation contrôlés.

**Seize rendus EGL/GLES** : profils et faces des deux morphologies avec réglages extrêmes de traits/maquillage/dimensions, trois quarts, pull en marche, poitrine discrète et pleine, robe de grossesse, repas assis, sommeil, lecture, studio réel, enfants, conversation et café. Shaders réels et commandes du jeu exécutés sous Mesa/llvmpipe, sans erreur de shader ou de GL. Vues de profil et scènes inspectées, puis deux contrôles finaux de la veste à manches longues. Les données sont des parties synthétiques. Les tests d’interface utilisent un DOM simulé ; tactile/CSS natifs Safari et FPS iPhone ne sont pas mesurés.

La surface du visage porte directement ses couleurs : aucun maillage séparé de maquillage ne peut rester devant la tête. Le relief du buste et ses normales utilisent la même déformation pour la peau et les vêtements, avec une seule exponentielle par sommet ; les hauts sont dérivés de la surface du corps et héritent de ses poids d’articulation. Cache 9.0.1 pour les 42 scripts, syntaxe JS/CJS, manifeste, identifiants HTML et fichiers présents contrôlés. Le rendu conserve sa base stylisée ; ni nouvel asset humain photoréaliste ni animation faciale complète annoncés.

# Vérifications — V9.0.0

Depuis main `612e194f7acf70c8849790e6df26396f8bee5c1e`, branche `develop/v9-personnages-vie`, 12 octobre 2026. Publication selon l’autorisation permanente de la propriétaire conservée dans README.

**332 tests dans quatorze suites** : simulation 73, économie 7, quartier 28, révision 15, foyer 20, refonte 12, immersion 12, famille 26, aménagement 24, quotidien 39, grossesse 5, naissances 24, personnages V9 16, rituels/proménades V9 31. Les quatre assertions de taille de catalogue/cache sont actualisées à 22 tenues et 42 scripts ; les anciens scénarios ne sont pas retirés.

Les nouveaux essais vérifient vingt coiffures propres à leur morphologie, indices/poids/hauteurs bornés, lissage conservant toutes les positions et articulations, vêtements et jupe midi, rendu des 22 styles × 10 coiffures × 2 morphologies sous stub, motifs réinitialisés entre personnages et masqués au travail, sauvegardes indépendantes et deux adultes, quatre looks, cinq sections du studio, quatre bases de traits, poses/grossesse finies et réutilisation du cache de sourcils.

Côté foyer : plans par défaut/personnalisés/en pause, imports bornés, préparation physique du dîner puis trajet à table, attente sans consommation, achèvement unique, annulation/refus/absence, rechargement sans débit fantôme, manque de repas, priorités du travail et des soins, point d’approche stable et message unique, télévision allumée dès le début, nouveau jour et boutons accessibles. Promenade libre sans prise des commandes, départ conditionné, itinéraire réel depuis chacune des trois maisons, positions valides et déplacement du compagnon limité à sa vitesse, trafic, arrivée seule sans gain, arrêt/échéance sans bonus, reprise au même repère, changement de membre sans auto-accompagnement, activité interrompant la promenade, récompense quotidienne unique et douze souvenirs bornés.

**Rendu GPU réel** : 17 scènes (portraits, six tenues, rayures/fleurs/carreaux, cheveux vus de dos, grossesse, repos, repas, TV, discussion et promenade) puis quatre contrôles finaux (sourcils, dîner, TV et cadrage de la promenade). Les shaders sont compilés sous Mesa EGL/GLES/llvmpipe, sans erreur de shader/GL. Les images sont inspectées, mais il ne s’agit ni d’un Safari iPhone ni d’une mesure de FPS. Les données sont des parties synthétiques, sans sauvegarde privée.

42 scripts locaux et cache 9.0.0, fichiers présents, identifiants HTML uniques, manifeste, syntaxe JS/CJS et différences sans erreurs d’espaces vérifiés. Les anciennes histoires et l’annonce de naissance restent compatibles. Les tenues/couleurs/visages changent réellement le rendu ; les descriptifs de goûts restent narratifs. Le moteur, les modèles de base CC0 et les limites médicales/sociales existantes restent explicitement décrits.

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
