# V12.5.1 — Histoires de vie : accès et sauvegardes

Les six histoires de V12.5 sont accessibles depuis le bouton Foyer, le menu principal et les deux entrées du téléphone. Les résumés et souvenirs utilisent des retours à la ligne lisibles. Chaque histoire reste un choix ponctuel avec bonus de jauges et souvenir ; elle ne lance pas de nouvelle scène 3D et ne se renouvelle pas chaque jour.

Les histoires de couple et de famille se jouent avec le personnage principal. Quand un second adulte est contrôlé, une indication explique comment reprendre le personnage principal ; ses histoires de quotidien et de métier restent accessibles. Un choix ne peut plus attribuer au second adulte l’affection liée au couple principal.

La confirmation distingue un souvenir enregistré d’un choix encore présent seulement dans la session. Si l’enregistrement échoue, deux actions permettent de réessayer ou d’exporter la sauvegarde. Réessayer ne rejoue pas le choix et ne redonne pas les bonus. Les anciennes sauvegardes et les six identifiants d’histoires sont conservés.

Validation dédiée : `node tests/life-stories.test.cjs` couvre les douze options, les conditions, les accès, les deux adultes, la reprise et les échecs de stockage. Le navigateur distant affiche « WebGL indisponible » ; il ne permet pas de valider l’interaction 3D ni le tactile Safari/iPhone. Détails des contrôles exécutés dans `TEST_RESULTS.md`.

# V12.4.0 — Peau et mèches, première étape vers un rendu plus naturel

Les visages adultes utilisent désormais deux cartes de détail RGB de peau MakeHuman CC0, converties en 512 × 512 pixels et teintées par la couleur choisie. Elles apportent des variations de peau et de lèvres sur le visage. Le masque écarte les raccords du cou et les bras ; ce détail photographique est désactivé sous 18 ans. Le blanc des yeux et les réglages d’apparence restent ceux du personnage choisi.

Les coiffures longue, carrée, ondulée, queue de cheval et pixie utilisent des mèches en feuillets courbes croisés, avec détails fins et bords effilés. Les cheveux longs ont des mèches devant les épaules et une raie étroite ; la coupe courte reçoit un relief balayé. La coupe bouclée conserve ses volumes précédents, après rejet des essais de spirales et de calotte continue. Les dix indices de coiffure restent compatibles avec les sauvegardes.

L’éclairage des personnages est calculé sur les couleurs linéaires avant conversion d’affichage. Le modèle anatomique et les vêtements existants sont conservés. Ce travail est une première étape : le résultat reste stylisé, ne reproduit pas la qualité photoréaliste d’inZOI et ne constitue pas une refonte complète du moteur 3D.

Comparaison des rendus réels, à caméra et réglages identiques : `docs/personnage-v12-4-avant-apres.png`. Les 21 suites locales passent après ajustement des feuillets pour conserver le budget des coiffures. Détails et limites de validation dans `TEST_RESULTS.md` ; sources et reconstruction dans `ASSETS.md`.

# V12.3.0 — Finition des personnages

Les iris sont agrandis et reçoivent un contour, des nuances radiales et un reflet ; le blanc de l’œil est plus doux et ombré sous la paupière. Les sourcils ont une variation fine et la peau reçoit un éclairage enveloppant et un reflet discret. Le teint et les réglages de visage choisis restent appliqués.

Les coupes longue, carrée, ondulée et tressée partent plus bas sous la calotte, avec des mèches superposées et effilées. Les chignons ont un volume arrondi ; la coupe bouclée reçoit des volumes géométriques, limités à 64 pour tous les âges. Les dix coiffures et vingt-deux tenues conservent leurs indices. Pas de nouvelle texture ni de téléchargement externe ; les vêtements et animations existants sont conservés.

Les 21 suites locales passent, y compris les contrôles étendus des dix coiffures sur les huit modèles d’âge/morphologie. Portraits, clignement, marche et scène de foyer sont inspectés par rendu EGL/GLES. La fluidité et le toucher sur iPhone 16 restent à vérifier sur appareil. Cette finition conserve un rendu stylisé.

# V12.2.0 — Chambre, repas et cuisine

Le canapé Aurore de V12.1 est conservé. Les cinq logements reçoivent maintenant un lit à cadre en bois avec tête rembourrée, oreillers, drap et plaid avec plis ; une table aux coins arrondis et deux chaises à assise rembourrée/dossier courbe ; une cuisine avec façades et poignées, plan de travail avec ouverture réelle pour l’évier, cuve et robinet courbe, plaque à induction ; un frigo aux portes et poignées distinctes.

Les textures locales d’Aurore sont partagées avec ces meubles. Les thèmes existants colorent le plaid et les façades. Les buffers des quatre modèles sont également partagés entre les maisons ; aucun fichier distant ou Blender nécessaire pour jouer. Le mobilier procédural reste disponible à distance et si le nouveau shader est indisponible.

Dormir, manger à deux, cuisiner, réorganiser les trois meubles d’origine et reprendre une ancienne partie utilisent les mêmes emplacements et règles. Le frigo devient transparent lorsqu’il masque les personnages ; les placards hauts suivent la coupe du mur arrière pendant la vue de cuisine. La cuisine et le frigo restent fixes.

21 suites locales passent, dont six tests pour les nouveaux intérieurs. Les shaders et scènes sont vérifiés par rendu EGL/GLES hors navigateur. La fluidité et le toucher natifs sur iPhone 16 restent à tester sur appareil. Le rendu demeure stylisé ; cette étape ne remplace pas les personnages ou la ville.

Reconstruction : `python3 tools/build_interiors.py` avec NumPy. Détails de provenance et tests dans `ASSETS.md` et `TEST_RESULTS.md`.

# V12.1.0 — Canapé Aurore dans le jeu

Le modèle Aurore préparé pour Blender est maintenant affiché directement dans les cinq logements : assises et dossiers arrondis, coussins sauge/argile, passepoils et structure/pieds en chêne. Ses textures de tissu, de bois et de relief sont embarquées localement. Les thèmes Sauge et Roseraie restent appliqués au tissu principal.

Les six groupes de matériaux partagent un seul jeu de buffers entre les logements. Le modèle détaillé apparaît à moins de 18 mètres ; le canapé procédural reste utilisé à distance, ou si le nouveau shader ne peut pas être initialisé. Les cartes sont préparées en 128 × 128 pixels avec mipmaps. Aucun chargement distant, compte ou installation de Blender nécessaire pour jouer.

Placement, rotation, places assises, trajets, ombres de contact et anciennes sauvegardes gardent leurs coordonnées. Il n’y a aucune remise à zéro de la partie. Travail, auto-école et conduite assistée de V12.0.1 sont conservés. Cette étape concerne le canapé ; les autres meubles et les personnages conservent leur rendu précédent.

Le modèle comporte 9 750 sommets et 15 792 triangles, avec environ 643 ko de géométrie et textures décodées partagées. Cela ne constitue pas une mesure de FPS. Rendu WebGL vérifié hors navigateur et tests de simulation exécutés ; Safari, le toucher et la fluidité sur iPhone 16 restent à observer sur l’appareil.

Reconstruction : `python3 tools/build_furniture.py` avec NumPy/Pillow. Source originale et détails dans `ASSETS.md` ; validation dans `TEST_RESULTS.md`.

# V12.0.1 — Auto-école repérable

La voiture bleue d’apprentissage est désormais stationnée et visible devant l’École Soleil, à gauche du quartier, avant de démarrer le parcours. Téléphone → Mobilité → **Trouver l’auto-école** affiche le repère et un chemin de points dorés. La carte contient aussi une entrée Auto-école. Approche la voiture puis utilise **Passer le permis** ; inscription/code et parcours accompagné restent réels, le permis est remis uniquement à la fin du parcours.

La voiture achetée propose désormais **Utiliser ma voiture** lorsqu’on s’en approche. La conduite reste assistée. Les itinéraires des habitants et enfants évitent la voiture d’apprentissage stationnée.

# V12.0.0 — Métiers accessibles et intérieurs retravaillés

Le bouton **💼 Travail** ouvre le poste choisi, sa distance, les conditions de service et les tâches. Choisir un métier dans Téléphone → Emplois, rejoindre le repère puis commencer sur place entre 8 h et 20 h. Les sept métiers proposent quatre tâches et des choix concrets ; le salaire arrive à la fin du service. Le conjoint peut conserver son propre emploi.

Canapés, lits et tables reconstruits avec cadres, pieds, coussins, textiles et finitions ; cuisines avec façades, poignées, frigo et plaque à induction. Matières de bois, sols, tissus et verre plus détaillées. La caméra masque les murs qui gênent la vue et conserve les autres. Les appartements ont des façades distinctes ; leurs étages supérieurs restent décoratifs. Les aménagements sauvegardés des deux appartements sont conservés au chargement.

Les huit bases de personnages conservent maintenant la résolution source de leur tête. Lèvres et nez sont repérés sur chaque base ; la lumière du studio arrive de face. Les coiffures longues, chignons et queues de cheval utilisent des mèches courbes plus fines ; les boucles courtes ont un relief et une texture adaptés au crâne. Les anciens choix d'apparence et les parties restent compatibles.

Le jeu conserve un rendu stylisé, des vêtements procéduraux et des animations simples. Cette mise à jour ne lui donne pas la qualité graphique des Sims 4 ou de One State. Les FPS et le tactile natifs de l'iPhone 16 doivent être évalués sur l'appareil.

# Mon Monde 3D — V11.0.0 · âges, logements et vie de ville

## V11 : changements jouables

La marche V10 est conservée. Modèles CC0 spécifiques pour bébés, enfants et aînés, pouce gauche corrigé, jupe moins entraînée par les cuisses, coiffures ajustées à chaque crâne. Les aînés ont des cheveux progressivement gris et des marques du visage intégrées à la peau.

Le téléphone propose **Logements**, **Vêtements**, **Vie et âges**, **École** et **Mobilité**. Deux appartements accessibles au rez-de-chaussée complètent les trois maisons : achat, location avec caution/loyer par journée de jeu, colocation avec un second adulte contrôlable et revente à 80 % du prix. Pas d’expulsion automatique ; les impayés restent consultables et peuvent être réglés. Les étages supérieurs ne sont pas accessibles.

Les 22 tenues sont disponibles dans une boutique payante, avec un dressing partagé. Les tenues des anciennes sauvegardes sont conservées, et la première tenue d’une nouvelle partie est offerte. Les couleurs, coiffures, visage et meubles existants restent personnalisables. Un mode créatif explicite permet d’ajouter 500 ou 5 000 sols.

Sept emplois avec quatre tâches et décisions chacun : café, épicerie, jardinier, cuisine, enseignement, mécanique, accueil du centre. Quatre habitants supplémentaires, deux aînés, école et atelier accessibles. Les employés restent à leur poste pendant les horaires de travail après leur salaire journalier ; au parc les activités varient, la lecture se fait assise.

Les enfants et bambins rejoignent l’école en semaine, sont assis pour les cours et déjeunent sur place ; la présence et les cours du personnage enfant sont enregistrés. L’âge peut être choisi dans Vie et âges. Les nouveaux bébés ont un âge fixe jusqu’à modification explicite. Les anciennes familles conservent leur progression. Les futures grossesses peuvent durer 3, 7 ou 14 journées fictives ; l’accueil reste manuel et annoncé.

Deux voitures achetables/revendables à 70 %, inscription au code puis parcours accompagné dans le monde pour obtenir le permis. Les déplacements en voiture sont **assistés**, avec arrêts à confirmer et freinage devant piétons/véhicules. Pas de volant libre, physique automobile ou intérieur détaillé. Les routes, logements et lieux s’étendent jusqu’à ±49,5 mètres.

Les sauvegardes restent sur l’appareil ; aucun compte ou serveur ajouté. Aucun enregistrement vidéo privé ni sauvegarde personnelle n’est publié. Safari iPhone 16 n’est pas disponible dans l’environnement de test : les FPS natifs et le toucher doivent encore être observés sur cet appareil.


Les corps et visages féminins/masculins utilisent désormais une **nouvelle base humaine MakeHuman CC0**, adaptée au moteur existant. La tête, le nez, les oreilles, les mains et la silhouette proviennent du nouveau maillage anatomique ; les anciennes apparences restent personnalisables. Ce changement conserve le quartier, les activités, les histoires et les sauvegardes privées sur l’appareil.

- **Visages :** yeux ajustés à chaque modèle, sourcils/lèvres/maquillage sur la peau, paupières qui clignent et légers mouvements de bouche pendant la discussion/le repas. Les réglages de traits et de teints sont conservés. Les lunettes suivent les dimensions et la profondeur du nouveau visage.
- **Coiffures :** dix choix conservés sur chaque morphologie ; ligne des cheveux et longueurs ajustées, carré plus arrondi, tresses en volume et boucles posées sur la surface réelle du crâne. Elles sont construites une fois au chargement.
- **Vêtements :** les 22 styles et quatre motifs restent disponibles. Épaules, cols, manches et bas sont recalculés depuis les nouveaux corps. La poitrine adulte garde son réglage personnel avec une amplitude adaptée au relief déjà présent dans le nouveau modèle ; corps, vêtements et grossesse partagent les déformations. Chaussures plus fines avec semelles et lacets.
- **Mouvement :** marche à pieds alternés, appui au sol, levée du pied et course distincte. La phase suit la distance réellement parcourue par le joueur et les habitants, y compris lorsqu’une collision arrête le déplacement. Transitions de gestes en 0,30 seconde et respiration au repos ; l’animation visuelle ne consomme aucun repas, argent ou temps de simulation.
- **Studio :** ouvrir **Style → Voir mon personnage en 3D → Gestes** pour essayer **Marche, Course, Assis et Téléphone**, en plus du repos, de la discussion, de la lecture, du repas et de la cuisine. Les contrôles de rotation et les cinq sections restent accessibles.

Chaque corps comprend 7 098 sommets et 14 172 triangles, dont les yeux. Les deux bases occupent environ 647 ko de JavaScript local, contre environ 1 Mo précédemment. Les vêtements détaillés ajoutent leurs propres triangles ; ces tailles ne constituent pas une mesure de FPS. Aucune ressource 3D distante n’est chargée pendant la partie.

**Limites :** rendu semi-réaliste léger, expressions simples, doigts attachés aux mains et enfants encore représentés par des modèles réduits. Ni photoréalisme, ni capture de mouvements, ni système facial complet annoncés. Safari natif, tactile et FPS sur iPhone 16 restent à mesurer sur l’appareil. Validation reproductible dans `TEST_RESULTS.md`, provenance et reconstruction dans `ASSETS.md`.

La clé de sauvegarde et le schéma restent identiques. Argent, logements, meubles, enfants, grossesses, relations, métiers, apparences des deux adultes et histoires restent enregistrés comme auparavant. Aucune sauvegarde ni capture personnelle n’est incluse dans le dépôt.

## Historique — V9.0.1

# Mon Monde 3D — V9.0.1 · visage intégré et silhouette

Correctif de la vue de profil signalée sur iPhone. Les sourcils, les lèvres et le maquillage s’appliquent désormais à la surface articulée du visage. Ils suivent la rotation de la tête, les animations et les réglages de mâchoire, de largeur et de lèvres. Les accessoires restent des objets distincts.

La morphologie féminine adulte a un buste arrondi, avec un réglage **Poitrine : discrète / plus pleine** dans **Style → Voir mon personnage en 3D → Corps**. Corps et vêtements suivent le même volume. Les hauts sont construits sur la surface articulée du corps, avec des épaules continues et un col ajusté à la chemise. Ce réglage personnel reste enregistré lors de la reprise et du changement d’adulte jouable ; les anciennes apparences reçoivent une valeur intermédiaire. Les enfants et les morphologies masculines ne reçoivent pas ce volume supplémentaire.

Les histoires, familles, enfants, grossesses, relations, argent, meubles et activités de la V9 sont conservés. La clé de sauvegarde et le schéma restent identiques. Le rendu demeure stylisé sur les modèles CC0 existants ; cette correction ne remplace pas les modèles par des humains photoréalistes. Validation détaillée dans `TEST_RESULTS.md`.

# Mon Monde 3D — V9.0.0 · visages et vie de foyer

Cette mise à jour conserve le quartier, les logements, les métiers, les familles et les sauvegardes. Elle reprend le rendu des personnages et ajoute des activités partagées réellement jouables.

## Personnages et studio

- Dix coiffures reconstruites séparément sur les têtes féminine et masculine : calotte ajustée, raccords des longueurs repris, queues/chignons et boucles de taille contenue. Les indices des anciennes coiffures sont conservés.
- Normales du corps et des vêtements adoucies ; silhouette féminine moins accentuée. Iris et pupilles placés selon la géométrie du visage, y compris sur le modèle masculin dont les anciennes UV ne convenaient pas. Sourcils courbes légers, cils atténués et lèvres plus discrètes. La base humaine reste le modèle CC0 stylisé existant.
- Six tenues supplémentaires, soit **22** : robe midi, chemisier en lin/pantalon, pull fin/jean, veste superposée/jean, ensemble décontracté et blouse/jupe midi. Maillages dédiés au lin, à la maille, à la veste et à la jupe midi ; les articulations et la grossesse restent compatibles.
- Quatre motifs de tissu : uni, rayures, petites fleurs et carreaux. Ils s’appliquent aux hauts et aux jupes, avec les couleurs existantes. Quatre looks prêts à porter ajoutés. Les habitants ont des combinaisons de vêtements et motifs plus variées.
- Studio en cinq sections **Visage / Cheveux / Tenue / Corps / Gestes**, avec cadrage du visage adapté à chaque morphologie. Quatre bases de traits éditables ; tourner, changer de coiffure, de motif ou de corps reste possible en direct. La création ne fait pas avancer la journée.

## Une vie de foyer à partager

**Un rendez-vous quotidien pour parler de la journée est prévu par défaut à 20 h** lorsqu’un membre partage le foyer. Depuis **Logement → Rituels et vie du foyer** ou **Nos moments → Rituels, promenades et souvenirs**, choisir un dîner à 19 h, une émission à 20 h 30 ou une discussion à 7 h/20 h ; la mise en pause reste disponible.

À l’heure choisie, l’autre adulte se déplace vers le lieu du rendez-vous. Pour le dîner, il cuisine réellement deux portions en quatre étapes lorsqu’il reste une provision et qu’il manque deux repas. Il vient à table, attend et propose de partager. L’invitation n’impose aucune activité ; rejoindre, accepter ou remettre à plus tard est possible. Le repas partagé consomme deux portions seulement à son achèvement. Annuler ne consomme pas de repas. Travail, repos, hygiène, rendez-vous déjà pris et soins urgents restent prioritaires. Une invitation ignorée libère la personne ; le message du rituel n’est envoyé qu’une fois par journée.

**Promenade à deux** : se retrouver à la maison, puis choisir le départ dans Vie de foyer. Le joueur marche librement avec ses commandes habituelles ; l’autre adulte le suit par les chemins du quartier. Trois repères passent du jardin à la rue, au quartier, puis au parc. Chaque repère est validé lorsque les deux personnes sont proches ; atteindre seul le parc n’accorde rien. Attendre son compagnon est parfois nécessaire, notamment en courant. Arrêt manuel, activité, service, nuit ou échéance de quatre heures fictives interrompent la promenade. Elle peut reprendre après un rechargement au même repère. Une balade terminée augmente loisirs/lien une fois par journée, sans argent gratuit ni bonus partiel.

Douze souvenirs récents de rituels/proménades sont conservés, avec le personnage et le jour. Ils apparaissent dans **Notre quotidien** et certains échanges spontanés les évoquent. Les profils des huit habitants donnent accès à leur intérêt et à une conversation jouable autour de celui-ci ; ce sont des descriptions écrites, pas une simulation psychologique complète. Une émission partagée allume désormais la télévision dès son début.

## Vérification de cette version

**332 tests dans quatorze suites** : 285 vérifications précédentes conservées, 31 pour les rituels/proménades/reprises et 16 pour les personnages/studio. Les trajets à deux ont été parcourus depuis les trois maisons avec les collisions et le trafic, sans téléportation. Dix-sept scènes différentes, plus quatre contrôles du rendu final, ont été dessinées sous EGL/GLES sans erreur. Les tests d’interface utilisent un DOM simulé ; CSS, gestes Safari natifs et FPS sur iPhone ne sont pas mesurés. Les sourcils utilisent un maillage courbe mis en cache afin d’éviter dix dessins séparés par visage.

Le rendu reste stylisé, les dialogues écrits et l’accueil du bébé simplifié. Cette étape ne remplace pas les personnages par des humains photoréalistes et ne transforme pas le projet en un équivalent complet des Sims ou de One State. Les naissances annoncées V8.0.2 et le choix explicite d’accueil sont conservés. Aucune sauvegarde privée n’est incluse dans le dépôt.

# Mon Monde 3D — V8.0.2 · naissances visibles

Une grossesse arrivée à son échéance ne crée plus d’enfant automatiquement. Un écran met le jeu en pause et propose de préparer l’accueil, rentrer à la maison ou attendre. Le rappel **Bébé attendu** reste dans l’interface. **Mon foyer** affiche la progression et explique que dormir avance les trois jours fictifs.

Depuis la maison, l’accueil gratuit propose de confirmer le prénom, puis une transition de dix-huit secondes, annulable. Le personnage principal qui porte la grossesse se repose au lit ; pour un autre porteur, le personnage contrôlé effectue la démarche au téléphone. Le jeu ne simule pas les étapes médicales d’un accouchement. L’enfant est créé uniquement à la fin, puis une annonce reste affichée avec sa date et ses soins. Fermer le jeu avant de lire l’annonce conserve celle-ci à la reprise ; une transition inachevée conserve la grossesse et peut être recommencée sans débit.

Les anciennes sauvegardes présentant des enfants sans annonce reçoivent un récapitulatif à la reprise, une fois par enfant. Aucun enfant, besoin, stade d’âge ou solde n’est effacé ou remis à zéro. Les annonces ne coupent pas les activités, le téléphone, le studio ou les autres menus.

Validation : **285 tests dans douze suites**, dont 24 scénarios de naissance et de reprise. Rendu de la transition sous EGL/GLES sans erreur ; pas de mesure de FPS ni de tactile natif sur iPhone. Publication selon l’autorisation permanente ci-dessous.


Correctif du rendu observé dans l’enregistrement iPhone : le ventre de grossesse n’est plus une sphère indépendante. Le corps et les vêtements se déforment ensemble, avec les mêmes articulations, une amplitude bornée et un éclairage adapté. Les calendriers familiaux, tenues et sauvegardes restent compatibles. Les coiffures et les personnages restent stylisés.

L’interface de l’enregistrement apparaît réduite. Le fichier contient déjà un viewport mobile correct ; ce correctif ne prétend pas résoudre une éventuelle mise à l’échelle de Safari sans mesure sur l’appareil.


Jeu personnel de simulation de vie en 3D, pour Safari sur iPhone et les navigateurs d’ordinateur. Cette version reprend le projet existant, sa maison, son jardin, ses activités et ses sauvegardes. Le quartier reste continu. Les modèles humains CC0 sont inclus localement ; le jeu ne télécharge aucune ressource externe.

**V8.0.0 préparée sur `develop/v8-quotidien-vivant`, selon l’autorisation permanente de publication donnée le 12 octobre 2026.**

## Autorisation de publication

Le 12 octobre 2026, la propriétaire a autorisé la publication de la V6 et des mises à jour suivantes de Mon Monde 3D sans nouvelle demande de confirmation. Cette autorisation remplace la consigne précédente demandant son accord avant chaque publication. Développer sur une branche distincte, vérifier les changements et les sauvegardes, puis publier les versions validées et rendre compte du résultat. Les sauvegardes privées restent locales et ne doivent pas être ajoutées au dépôt. Cette autorisation concerne ce jeu ; elle ne crée pas de développement exécuté en arrière-plan ou de tâche planifiée.

## Quotidien vivant V8

Depuis la V7 publiée (`6f15898dce0d7bca8876472831e768e065a17c43`), avec les parties, logements, meubles et identités conservés.

- **Conversations spontanées** : le conjoint ou l’autre adulte du foyer vient à pied. Après une courte pause immobile à la maison, quatre répliques prédéfinies alternent entre les personnages, avec gestes, orientation face à face et cadrage des deux silhouettes. Marcher, ouvrir un menu/téléphone ou choisir Plus tard interrompt librement. Les besoins sociaux et le lien évoluent uniquement à la fin des huit secondes ; les propositions respectent un délai. Poursuivre ouvre les vraies activités de foyer.
- **Journées moins uniformes** : lecture avec livre, téléphone, émission au salon et pause au jardin de Soleil (devant la maison dans les deux autres logements). Ces routines changent selon l’heure. Travail, sommeil, faim, hygiène, soins et rendez-vous restent prioritaires.
- **Moments côte à côte** : un adulte libre peut rejoindre spontanément une lecture au canapé, une émission ou un repas du joueur à table. Il marche jusqu’à sa place, y reste réellement quelques secondes, puis bénéficie du moment seulement si l’activité se termine. Le repas utilise une portion par personne ; pas de débit du second repas sur annulation, départ du conjoint ou faute de nourriture. Les activités explicites Dîner à deux restent disponibles.
- **Cuisine et enfants** : le conjoint prépare, découpe, surveille et dresse deux portions en vingt secondes, en consommant une provision, puis envoie un message dans le téléphone du jeu. L’aide aux enfants, lorsqu’elle est activée dans Foyer, fait marcher le parent vers l’enfant ; elle ne nourrit plus un bébé depuis l’autre côté de la pièce. Travail et activité manuelle avec ce parent interrompent cette aide.
- **Apparence** : quatre nouvelles tenues (blouse légère/jupe, T-shirt ajusté/jean, chemise à manches retroussées, pyjama doux), soit **seize** au total. Les nouveaux hauts suivent la surface et les articulations du corps CC0, avec leurs propres maillages ; chaussons du pyjama. Les sommets identiques des vêtements sont regroupés au chargement. Lèvres au repos moins marquées selon le teint, sourcils allégés et sourire discret en conversation.
- **Positions corrigées** : les personnes sont assises devant le dossier du canapé, avec les jambes visibles. Observer cadre les deux participants lorsqu’ils partagent une activité. Deux emplacements distincts pour dormir dans le lit double, pyjama affiché sans perdre le vêtement choisi. Si un troisième adulte partage ce foyer (autre adulte jouable et conjoint du personnage principal), il se repose sur le canapé. Les échanges du second adulte ne lui inventent pas une relation amoureuse avec le conjoint du principal.
- **Réglages et reprise** : Logement → Habitudes du foyer permet d’activer/arrêter les initiatives, les conversations/loisirs et les moments partagés. Les choix et le nombre de repas partagés sont sauvegardés. Les anciennes initiatives mises en pause restent en pause ; ce menu permet de les réactiver. Les scènes inachevées ne redémarrent pas après rechargement et ne produisent aucun gain fantôme.

Validation : **256 tests dans dix suites**, dont 39 nouvelles vérifications, et dix-sept scènes rendues en EGL/OpenGL ES sans erreur. Le navigateur Chrome de test ne fournit pas WebGL : aucune validation native Safari, CSS/tactile iPhone ou FPS n’est annoncée. Le rendu reste stylisé ; dialogues écrits, soins et cuisine simplifiés, grossesse de la version précédente conservée. Détails dans `TEST_RESULTS.md`.

## Aménagement V7

À partir de la V6 publiée (`305dcc2b85544357754bbd2a368009cdc79093dc`), sans remplacer les familles, identités ni les parties enregistrées.

- **Lit, canapé, table et chaises** : Logement → Réorganiser lit, canapé et table. Touche le plan, ajuste par pas de 25 cm, tourne par quarts de tour, puis valide. Déplacement gratuit ; annulation sans effet. Les murs, cuisine, salle de bain, télévision, table basse et lampes restent fixes.
- **Un meuble réellement déplacé** : le modèle 3D, les collisions, les ombres de contact, les points d’interaction, les places pour dormir/lire/manger et les destinations du partenaire suivent ensemble. Les places réservées au mobilier acheté suivent aussi les sièges. Aucun nouveau mesh de mobilier construit à chaque image ; les modèles existants sont réutilisés.
- **Passages protégés** : refus près des murs, d’un meuble ou d’un personnage, et vérification des trajets vers cuisine, chambre, salon, table, salle de bain, lits d’enfants et sortie. La petite boucle de déplacement des enfants reste libre. L’espace disponible dépend de la maison et des autres meubles : déplacer la table peut libérer de la place pour le lit.
- **Conservation** : chaque maison garde son aménagement dans la sauvegarde locale. Reprise après fermeture, changement de personnage et déménagement conservent ces données. Un placement enregistré invalide est écarté ; un meuble acheté gênant est rangé sans être perdu.
- **Retour au plan initial** : option Rétablir les emplacements d’origine dans le même menu. Tous les meubles achetés sont alors rangés, prêts à être replacés. Les autres maisons gardent leur plan.
- **Retouches visuelles** : pieds des chaises, coussins placés au dossier et hauteur de sommeil corrigée pour ne plus enfouir le personnage dans le matelas. Le rendu reste stylisé ; les vêtements et cheveux ne disposent pas d’une simulation physique.

Validation V7 : **217 tests** dans neuf suites et huit scènes rendues hors navigateur avec EGL/OpenGL ES. Les tests de la V6 restent actifs. Safari/iPhone natif, CSS et FPS ne sont pas mesurés dans cet environnement. Détails dans `TEST_RESULTS.md`.

## Vie de foyer V6

Branche `develop/v6-vie-de-foyer`, issue de la V5 publiée. La V6 remplace la V5 après validation technique et autorisation de la propriétaire. Les sauvegardes restent locales ; aucun compte, paiement réel ou donnée personnelle n’a été ajouté au dépôt.

- **Personnages** : dix coiffures ajustées, avec une calotte découpée à partir de la surface du crâne CC0 plutôt qu’une grosse sphère. Deux coupes supplémentaires : pixie et chignon bas. Épaules, manches et volumes des hauts resserrés. Douze tenues au total, dont débardeur à bretelles/jupe, veste à col/pantalon, tunique/pantalon et sweat à col doux. Les réglages restent conservés pour les deux adultes et les parties indépendantes.
- **Initiatives sociales** : le partenaire qui vit à la maison, ou l’autre adulte jouable, peut venir proposer une discussion. Il emprunte un trajet réel et se tourne vers le personnage. Répondre ou remettre à plus tard reste libre ; aucune activité ne saisit les commandes. Ces propositions respectent le travail, le sommeil, les repas, les besoins faibles, les rendez-vous et un délai après les conversations. On peut les désactiver dans Vie de foyer.
- **Moments partagés** : raconter la journée, échanger des mots tendres avec le partenaire, parler des projets, dîner à deux ou regarder une émission ensemble. Le repas utilise **deux portions** et nourrit les deux personnes ; la télévision améliore les loisirs des deux ; discussion, lien et souvenirs évoluent. Annuler ne consomme pas le repas. Les textes sont écrits et prédéfinis, pas produits par une IA.
- **Logements** : bouton **Logement** visible. Maison Soleil ouverte ; Maison Sauge avec bureau ; Maison Roseraie avec chambre double et chambre des enfants séparées par des cloisons et des ouvertures praticables. Les trois maisons gardent le même terrain intérieur de base. Visite à pied, puis déménagement payé une seule fois. Les adultes du foyer, enfants et affaires suivent. Les meubles incompatibles sont rangés dans l’inventaire. On termine les services de travail avant de déménager.
- **Quotidien du partenaire** : nourriture à domicile prise en compte dans la journée, pas uniquement le soir ; repas prioritaire en cas de forte faim. Deux positions de sommeil distinctes dans le lit double. Le travail et les salaires existants sont conservés.
- **Enfants** : berceau remplacé visuellement par un petit lit quand l’enfant grandit ; trajet nocturne vers son lit. Les soins, besoins et étapes de croissance déjà présents continuent. Mila, enfant de Noah, et Lou, enfant d’Emma, sont deux personnages secondaires prédéfinis, avec petits lits et trajets maison/parc ; les parents ont une conversation sur leur famille. Ils ne rejoignent pas le foyer du joueur et leurs positions se réinitialisent au chargement.
- **Poussette et jouets** : poussette à acheter/placer pour 60 sols, coffre à jouets pour 35 sols. Une sortie en poussette montre un bébé du foyer et une pose de mains près de la poignée ; on accède aux soins pendant la sortie. La promenade se termine à la maison et reprend après fermeture/réouverture de la partie. La poussette suit le personnage avec un placement simplifié ; ce n’est pas une simulation physique de roues ou de véhicule. Un seul bébé accompagne cette sortie.
- **Caméra et meubles** : cadrage de repas ajusté à la largeur des écrans portrait, deux personnes visibles au salon ; la télévision devient transparente si elle les masque, sans supprimer sa collision. Éclairage de table plus chaleureux. Mobilier du catalogue toujours achetable, orientable et rangeable ; murs et meubles d’origine restent fixes. Dix meubles supplémentaires maximum, dix types au catalogue.
- **iPhone** : disposition portrait conservée, disposition paysage revue, boutons tactiles et barre du studio repositionnée. Un manifeste et les métadonnées iOS permettent de demander une ouverture autonome depuis l’écran d’accueil. Dans Safari : partager → Ajouter à l’écran d’accueil, puis lancer cette icône. Rotation selon l’appareil ; pas de verrouillage forcé ni de mode hors ligne annoncé. La présentation native iOS doit encore être vérifiée sur l’appareil.

Validation : **193 tests automatisés** dans huit suites, dont les anciens déplacements, salaires, collisions et sauvegardes. Treize scènes distinctes compilées et rendues hors navigateur avec EGL/OpenGL ES, de face/profil/dos et en paysage. Détails et limites dans `TEST_RESULTS.md`.

Cette étape conserve les modèles de base stylisés CC0 et les animations procédurales. Elle n’est pas un remplacement par des humains photoréalistes. Deux adultes contrôlables ; le second reste un membre indépendant et les projets de couple/grossesse restent attachés au principal. Les enfants utilisent des silhouettes simplifiées et une croissance en jours fictifs ; pas de nouvelle simulation médicale, de création illimitée de familles ou d’éditeur de murs.

## Immersion V5

Branche `develop/v5-immersion`, issue de la V4 publiée. La publication V5 remplace la V4 après l’accord de la propriétaire. Les sauvegardes et les activités existantes sont conservées.

- **Éclairage du monde et des personnages** : lumière directionnelle, ambiance du ciel, aube/crépuscule, nuit plus lisible, ciel en dégradé et étoiles. La brume dépend de la distance à la caméra. Les lampes éclairent aussi les personnages proches. Ombres de contact et de végétation stylisées, regroupées en trois dessins ; pas de calcul de vraies ombres projetées en temps réel.
- **Matières et paysage** : bois, tissu, herbe, trottoirs, métal, eau et vitrage reçoivent un traitement distinct. Parquet dessiné par le matériau, sans bandes fines qui scintillent à distance. Haies abaissées, couronnes d’arbres irrégulières, feuillage doucement animé, plantes d’intérieur et lampadaires de salon. Les obstacles et passages restent ceux déjà testés.
- **Personnages** : cinq coiffures originales retravaillées avec une implantation suivant le crâne et des volumes à l’arrière, éclairage de la peau/chevelure, haut féminin mieux ajusté aux épaules. Col réellement articulé sur chemise/polo et tablier sur les tenues du café et de l’épicerie. Huit looks prédéfinis au lieu de cinq, utilisant aussi les vrais réglages du visage et les accessoires. Le style reste stylisé et les modèles de base CC0 sont conservés.
- **Mobilier** : canapé, literie, coussins et fauteuil/banquette du catalogue ont des contours arrondis ; leurs volumes de collision sont conservés. Les meubles du catalogue gardent achat, placement, rotation et finitions. Les meubles d’origine et les murs restent fixes.
- **Activités mieux visibles** : bouton **Observer** dans une activité, rotation par les flèches ou glissement tactile, zoom par pincement/molette et retour **Vue libre**. Le cadrage est de face/oblique et montre les deux participants d’une conversation. Il ne remplace pas les réglages de caméra de déplacement. Fin, annulation ou restauration rétablissent la vue libre.
- **Gestes situés** : cuisine rapprochée du plan de travail ; personnes du café et de l’épicerie placées près du poste utilisé, sans regrouper les collègues sur le même point. Outils et casserole visibles, pages mobiles du livre et détails d’écran du téléphone. Les participants d’une conversation alternent le mouvement visible de la bouche. Les transactions, recettes et métiers sont ceux déjà jouables, sans nouvel argent fictivement promis.
- **Interface de jeu** : quatre commandes principales visibles (Téléphone, Menu, Style, Sauver), solde et état de sauvegarde ; personnages/foyer accessibles dans Menu. Besoins faibles signalés en rouge. Panneaux et commandes adaptés en CSS au portrait/paysage, à vérifier sur iPhone.

Validation : **167 tests** dans sept suites ; compilation et replay de 14 scènes avec EGL/OpenGL ES, en journée/nuit, plusieurs angles, lecture/cuisine/travail/conversation. Aucun nouveau téléchargement, compte ou envoi de sauvegarde. `TEST_RESULTS.md` précise ce qui a été mesuré et les limites.

## Refonte V4

**Publication V4.0.0 autorisée par la propriétaire le 11 octobre 2026 sur `main` et GitHub Pages.** Développement validé conservé sur `develop/refonte-personnages`. La base humaine articulée CC0 est conservée et enrichie. Cette version reste stylisée, sans modèle photoréaliste ni expressions faciales complètes.

- **Studio 3D isolé** : le décor et les habitants sont masqués pour inspecter le personnage. Tourner à gauche/droite par pas de 45°, glisser sur le rendu, cadrage visage ou silhouette, poses de repos, discussion, lecture, repas et cuisine. Les animations du studio utilisent leur propre horloge, sans faire avancer la partie. Le personnage est présenté de face à l’ouverture ; l’ancienne caméra revient à la sortie.
- **Visage personnel** : mâchoire et nez modifient réellement les sommets du visage ; lèvres, sourcils et intensité du maquillage modifient ses détails visibles. Boucles dorées, collier ou les deux ; clignements périodiques et petite animation de la bouche en discussion. Détails limités aux personnages proches pour limiter les dessins. Les réglages se sauvegardent par membre du foyer ; les anciennes parties reçoivent des réglages neutres.
- **Gestes adaptés** : les bras ont un placement analytique à deux segments, avec limites de portée. Les mains rejoignent des cibles différentes pour lire, manger, utiliser le téléphone, cuisiner, discuter et manipuler une livraison. La cuillère monte vers le visage, le livre ouvert est incliné et tenu entre les mains. Les animations restent procédurales, sans capture de mouvement ni doigts articulés.
- **Cuisine en quatre gestes** : préparer, découper avec un couteau, mélanger puis servir avec l’assiette. Annuler reste gratuit en provisions ; validation une seule fois. Casserole, planche, ingrédients et robinet ajoutés au plan de travail. Les métiers existants bénéficient des nouveaux gestes pour leurs poses déjà utilisées ; leurs règles et décisions sont conservées.
- **Huit tenues** : cardigan à manches longues et robe longue articulée ajoutés aux six styles existants. Silhouette féminine adoucie, calotte des coiffures ajoutées arrondie ; cheveux longs reculés pour éviter de traverser le haut, peau masquée sous les manches du cardigan.
- **Intérieurs** : coussins/oreillers arrondis, pieds du canapé, couches de literie, parquet et tapis détaillés, façades/poignées de cuisine, plaque redimensionnée, petite décoration encadrée et chemin de table. Les trois maisons héritent des détails sans modifier leurs volumes de collision.
- **Huit meubles supplémentaires au catalogue** : bibliothèque ouverte (80 sols), banquette capitonnée (70) et console avec miroir décoratif (55), en plus des cinq précédents. Achat, placement tactile, rotation, quatre finitions, déplacement et rangement restent communs. Bibliothèque et banquette proposent la lecture ; le miroir est décoratif. Dix meubles supplémentaires maximum. Les meubles d’origine et les murs restent fixes.

Validation : **155 tests** (143 conservés + 12 nouveaux), syntaxe et structure HTML. Rendus des personnages de face, de profil et de dos, gros plans, studio réel et intérieurs dans EGL/OpenGL ES ; détails dans `TEST_RESULTS.md`. Pas encore de validation CSS/Safari/tactile/FPS sur iPhone.

## Foyer jouable V3

Objectif de référence : liberté de déplacement de One State et quotidien/foyer des Sims 4. Cette étape ajoute un foyer partagé à la base existante ; elle ne prétend pas reproduire ces jeux entiers.

- **Mon foyer jouable** est visible pendant la partie et dans Menu. Ajouter un homme ou une femme adulte crée un second membre dans la **même histoire**. Son apparence se règle avec le vrai écran Style existant.
- Deux adultes contrôlables alternativement. Chacun conserve nom, âge, sexe, morphologie, coiffure, tenue, besoins, amitiés, compétences, métier et service. Maison, horloge, argent, provisions, repas, mobilier et enfants restent communs.
- Le membre non contrôlé est présent dans le monde : trajets au travail, gestes aux postes, salaire sur le compte commun, cuisine avec les provisions du foyer, repas, toilette, télévision et sommeil. Les routines sont simplifiées et le temps doit avancer, menus fermés.
- Les deux membres peuvent discuter face à face ou s’écrire/proposer un rendez-vous via le téléphone. Les messages sont prédéfinis. L’emploi se choisit avec le membre concerné : **Mon foyer jouable → Travail → Emplois**.
- Sauver, reprise automatique et export/import conservent tout le foyer, y compris l’adulte inactif. Changer de membre est refusé pendant une activité, un service actif, l’aménagement ou avec le téléphone ouvert. Un échec de stockage bloque le changement.
- **Mes parties** conserve les six histoires indépendantes de V2.5. Le bouton est distinct du foyer partagé ; une nouvelle histoire ne supprime pas les autres.

Première limite explicite : deux adultes jouables maximum. Le nouveau membre est un colocataire, sans couple automatique. Le couple, le conjoint existant et le projet de bébé restent attachés au personnage principal ; ils ne changent pas d’identité lorsque l’autre membre est contrôlé. Les enfants et le conjoint existant ne deviennent pas contrôlables. Le téléphone et son agenda restent communs. Aucun revenu hors ligne.

Aucun nouveau modèle humain ni refonte graphique complète dans cette étape : les modèles articulés, tenues et coiffures V2.5 sont conservés. Conduite, éditeur de murs, expressions détaillées et simulation professionnelle avancée restent à développer.

## Correctifs et ajouts V2.5

- Les rendez-vous sont terminés après une discussion réussie. Les échanges annulés conservent leur invitation.
- **Sauver** et **Mes parties** restent visibles pendant le jeu. Six parties indépendantes peuvent être créées, avec un personnage, un foyer et une économie propres. Ces personnages ne vivent pas tous ensemble dans le même quartier : chaque partie est une histoire séparée. Le personnage existant devient la première histoire sans remise à zéro. Export/import concerne la partie active.
- Carré, cheveux longs ondulés et tresses relevées ajoutés aux cinq coiffures. Le modèle féminin a des proportions adoucies au visage, aux épaules, à la taille et aux hanches. Les deux morphologies restent personnalisables ; aucun nouveau modèle photoréaliste n’est annoncé.
- Le projet de famille utilise un moment privé suggéré, un test le lendemain et une confirmation distincte. Le projet et son porteur restent sauvegardés. Les anciennes grossesses continuent normalement. Il s’agit d’une simulation simplifiée, sans animation sexuelle ou système médical réaliste.
- La cuisine montre quatre étapes sur 24 secondes : ingrédients, découpe/mélange, cuisson, dressage. Ustensile et assiette sont visibles. Les provisions et portions sont appliquées une seule fois à la fin ; annuler ne consomme rien.
- Les trois métiers proposent des décisions simples à chaque poste. Un mauvais choix ne valide pas le travail ; les gestes se jouent après le bon choix, et le salaire reste versé seulement après le service complet. Les tâches ne constituent pas encore une simulation professionnelle détaillée.
- Fauteuil avec coussins arrondis et pieds, plateau du bureau affiné ; quatre finitions choisies dans le plan tactile. Placement, rotation, rangement et recoloration des meubles supplémentaires restent gratuits après l’achat. Les meubles d’origine restent fixes.

## Fonctionnalités conservées

- Marche orientée vers le déplacement. Conversations face à face, personnes espacées et caméra cadrant le duo. Les habitants quittent leur siège pour discuter. Portes, montants et meubles masquant les acteurs rejoignent le rendu en coupe ou la transparence.
- Deux corps humains articulés, huit styles vestimentaires, six teints, huit couleurs de haut, huit coiffures et cinq couleurs de cheveux. Chemise/pantalon, blouse/jupe, T-shirt/short, polo/jean, pull à manches longues, tenue de sport. Couleurs indépendantes du pantalon et des chaussures. Sexe, âge de départ, morphologie, silhouette, taille, visage, yeux et lunettes restent réglables.
- Huit habitants : Lina, Noah, Emma, Adam, Inès, Sami, Jade et Hugo. Chacun conserve sa position, ses besoins, son emploi éventuel et sa progression de service. Ils mangent, lisent, se reposent, se rendent au travail et engagent des discussions entre eux.
- Trois métiers sur place : café, épicerie et jardinage. Quatre tâches visibles puis retour au poste de départ pour recevoir le salaire. Gestes et accessoires : assiette, commandes, provisions, arrosoir et balai. Les habitants employés suivent également ces postes physiquement.
- Le conjoint cohabitant a un métier choisi dans **Menu → Mon foyer → Métier et journée**. Son salaire rejoint le compte du foyer après son service complet, une fois par jour. Celui du joueur s’y ajoute. Le conjoint peut cuisiner deux repas avec une provision, manger un repas du foyer, se rafraîchir, se détendre, dormir et aider les enfants lorsque cette option est activée.
- Projet de bébé : vie commune, présence à la maison et partenaire proche. **Préparer notre projet à la maison** lui donne un rendez-vous ; fermer les menus puis attendre son arrivée. Choix du prénom et de la personne portant la grossesse. Moment privé suggéré dans la chambre, projet sauvegardé puis test disponible le lendemain. La grossesse confirmée atteint son échéance en trois jours fictifs, puis attend l’accueil choisi dans Mon foyer ; adoption disponible, notamment si aucune personne du couple ne peut porter la grossesse. Paiement après le moment partagé ; annulation gratuite. Les anciennes grossesses et les enfants sont conservés.
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

155 tests locaux passent : 73 de simulation/intégration, 7 d’économie/métiers, 28 du quartier/foyer, 15 de révision V2.5 20 du foyer jouable et 12 de refonte. Les gestionnaires d’interface sont exécutés avec DOM et WebGL simulés. Des rendus EGL/OpenGL ES compilent les shaders et dessinent les scènes réelles hors navigateur ; détails dans `TEST_RESULTS.md`.

```sh
node tests/simulation.test.cjs
node tests/daily.test.cjs
node tests/neighbourhood.test.cjs
node tests/revision.test.cjs
node tests/home-control.test.cjs
node tests/refonte.test.cjs
```

Le workflow **Vérifications du jeu** exécute ces suites sur `main`, `develop/**` et les pull requests. Il ne publie pas le jeu. La mise en ligne conserve le dépôt et la configuration GitHub Pages existants après accord, sans remplacement manuel du HTML.

Modules : `town.js` pour identités/logements/catalogues ; `core.js` et `daily.js` pour simulation/transactions ; `household.js` pour habitants/revenus ; `home-control.js` pour les identités personnelles et la sauvegarde du foyer ; `home-play.js` pour le contrôle et l’interface du foyer ; `motion-rig.js` pour le placement des bras, `face-design.js` pour les valeurs personnelles et `studio.js` pour le studio ; `housing.js` pour placement/migration ; `navigation.js` et `traffic.js` pour déplacements ; modules de rendu et d’interface pour le monde et les commandes. Aucun paquet à installer pour jouer ou exécuter les tests Node.js.

## Limites actuelles

CSS Safari, tactile natif et FPS sur iPhone 16 restent à valider sur appareil. Le rendu est stylisé, les animations procédurales et les réponses de dialogue prédéfinies. Pas de simulation physique du tissu ni d’expressions faciales détaillées.

Les voitures circulent mais ne sont pas conduisibles. Les trois logements partagent la même emprise de base. Lit, canapé et table/chaises se déplacent désormais ; murs, cuisine, salle de bain et certains équipements restent fixes. Les dix types du catalogue restent plaçables. Pas encore d’éditeur de murs/étages, de commerce géré par le joueur ou de loyer.

Le projet de bébé utilise un moment de couple habillé et un calendrier fictif. Deux enfants au maximum ; bambin après deux jours, enfant après quatre. L’âge choisi pour le joueur reste fixe ; enfants et aînés n’ont pas de corps dédiés. Pas de multijoueur, connexion de compte ni synchronisation entre appareils.

