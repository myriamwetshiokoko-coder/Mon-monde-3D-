# Mon Monde 3D — V8.0.1

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
- Projet de bébé : vie commune, présence à la maison et partenaire proche. **Préparer notre projet à la maison** lui donne un rendez-vous ; fermer les menus puis attendre son arrivée. Choix du prénom et de la personne portant la grossesse. Moment privé suggéré dans la chambre, projet sauvegardé puis test disponible le lendemain. La grossesse confirmée dure trois jours fictifs ; adoption disponible, notamment si aucune personne du couple ne peut porter la grossesse. Paiement après le moment partagé ; annulation gratuite. Les anciennes grossesses et les enfants sont conservés.
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
