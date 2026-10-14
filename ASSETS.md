## Canapé Aurore — V12.1.0

- Source : `assets/models/canape-aurore.glb`, création procédurale originale « Mon Monde 3D · Atelier Aurore », déclaration CC0-1.0 incluse dans le GLB. Aucun modèle commercial ou photo externe.
- Le source GLB d’origine est conservé ; `tools/build_furniture.py` produit `assets/aurore.js` pour le moteur WebGL 1. Ce script est un adaptateur statique de ce modèle (nœuds identité), pas un importateur glTF général.
- Positions/UV flottants, normales/tangentes int16 normalisées, indices uint16. Groupement en six matériaux. Orientation adaptée au canapé existant, largeur/profondeur contenues dans ses collisions. Les tangentes sont calculées depuis les triangles et UV et orthogonalisées ; aucun MikkTSpace complet revendiqué.
- Trois images PNG incorporées au GLB sont préparées en tuiles RGBA de 128 × 128 pixels. Coloration sRGB décodée pour l’éclairage ; carte de normales traitée linéairement, force 0,45 conservée. Matériaux simples avec lumière du monde et rugosité ; ce rendu n’est pas une implémentation PBR glTF complète.
- 9 750 sommets, 15 792 triangles ; sortie JavaScript de 858 106 octets. Le GLB source n’est pas téléchargé pendant le jeu. Aucun transfert de sauvegardes.

# Ressources 3D — V10.0.0

## Base humaine actuelle

Deux corps adultes sont préparés à partir des **données graphiques du cœur MakeHuman, CC0 1.0 Universal**. La licence du programme MakeHuman (AGPL) est distincte ; aucun code du programme n’est copié, exécuté ou inclus dans le jeu. Notre parseur et le convertisseur sont originaux.

- Licence officielle des données : https://static.makehumancommunity.org/about/license.html
- Déclaration du dépôt : https://github.com/makehumancommunity/makehuman/blob/a8bc2d54ff0ac92e78ff71431b1023eda42bf482/LICENSE.md
- Texte CC0 : https://creativecommons.org/publicdomain/zero/1.0/
- Commit source : `a8bc2d54ff0ac92e78ff71431b1023eda42bf482`.

`tools/character-sources.json` énumère les quatorze fichiers graphiques/licence utilisés, leurs URL fixées à ce commit, tailles et SHA-256. Sources : `base.obj`, rig et poids `default`, cibles adultes féminines/masculines macrodetails et yeux `low-poly`. Les corps combinent des cibles adulte/jeune africaines (40 %), asiatiques (20 %) et caucasiennes (40 %), indépendamment des teints personnalisables. Les groupes auxiliaires du modèle ne sont pas ajoutés à la surface visible.

Les positions sont adaptées au squelette à 21 articulations existant (pivots Quaternius CC0 conservés dans `tools/character-rig.json`), avec retarget des bras et jambes, réduction QEM et transfert des poids. Les normales anatomiques sont conservées, avec un adoucissement du torse. Chaque corps : **7 098 sommets, 14 172 triangles** (14 000 corps + 172 yeux), **241 188 octets binaires**. Quantification : positions à 0,1 mm, normales à 8 bits, quatre poids de skinning normalisés. `assets/humans.js` regroupe les deux corps en base64, environ 647 ko. Il ne contient plus les anciennes surfaces de sourcils ni les trois cheveux du pack précédent.

Les vingt maillages de coiffure (dix par corps) et les vêtements sont dérivés/générés localement au chargement. La subdivision des vêtements partage ses arêtes pour éviter des fissures lors des déformations. Les épaules, cols et poignets héritent des poids du corps ; les tresses sont des mèches en volume, les boucles sont placées sur le cuir chevelu. Il n’y a aucune image IA, texture distante ou animation téléchargée.

Reconstruction, avec Python et les dépendances **uniquement pour la préparation** :

```sh
python -m pip install -r tools/requirements-character-prep.txt
python tools/download_character_sources.py /chemin/vers/donnees-graphiques
python tools/build_natural_characters.py /chemin/vers/donnees-graphiques
```

NumPy, SciPy et fast-simplification ne sont pas distribués au navigateur. fast-simplification est MIT : https://github.com/pyvista/fast-simplification. Les poses, la locomotion, les expressions et les transitions sont calculées par le code original du jeu ; les doigts restent attachés au poignet, sans rig individuel. Les modèles enfants réutilisent des versions réduites de ces bases.

## Historique des ressources — V2.4 à V9.0.1

Les descriptions de tailles et de corps ci-dessous concernent les versions précédentes. Le convertisseur `tools/build_characters.py` est conservé pour reproduire ces anciennes versions ; il n’est plus utilisé par la V10.

# Ressources 3D — V2.4.0

Modèles et trois coiffures adaptés du pack **Universal Base Characters — Standard**, par Quaternius.

Source officielle : https://quaternius.com/packs/universalbasecharacters.html
Téléchargement officiel : https://quaternius.itch.io/universal-base-characters
Licence : **CC0 1.0 Universal**, https://creativecommons.org/publicdomain/zero/1.0/

Archive gratuite obtenue le 10 octobre 2026 : `Universal Base Characters[Standard].zip`. Le fichier `License_Standard.txt` confirme CC0 pour cette version. Aucune ressource de la version Source payante n’est incluse.

Éléments utilisés : `Superhero_Female_FullBody`, `Superhero_Male_FullBody`, `Hair_BuzzedFemale`, `Hair_Buns`, `Hair_Long` (glTF). Modifications : quantification, regroupement de 65 articulations en 21 (doigts rigidement attachés aux mains), orientation conservée vers +Z (corrigée en V2.3.2), réduction des attributs et suppression des textures. Vêtements/teints/couleurs et poses sont pilotés par le moteur du jeu. Les animations originales du pack ne sont pas utilisées ; les poses sont calculées par le jeu.

`assets/humans.js` contient environ 1 Mo de données locales : deux corps, yeux, sourcils, coiffures. 8 844 sommets / 15 060 triangles pour le modèle féminin ; 8 483 sommets / 14 318 triangles pour le masculin. Les coiffures ajoutent 830 à 3 284 triangles. Aucun téléchargement externe n’a lieu pendant le jeu.

Reconstruction : `python3 tools/build_characters.py /chemin/vers/le/pack-extrait`. Ce script nécessite NumPy uniquement lors de la préparation. Les modèles non sélectionnés et l’archive complète ne sont pas ajoutés au dépôt.

Le quartier, les accessoires, les couleurs, les sons et les maillages de secours restent ceux du projet.

V2.3.2 : les matériaux des yeux et sourcils du modèle masculin sont corrigés, y compris les noms avec suffixe dans le convertisseur. Corps, articulations et coiffures partagent l’axe avant +Z attendu par les déplacements et les poses.

Les vêtements sont générés localement par `src/humans.js` : haut à anneaux et manches articulées, chaussures arrondies et fermées, bas découpés et élargis depuis les maillages existants, jupe articulée. Ils héritent de la même licence pour les parties dérivées. Aucun nouveau téléchargement de ressource, texture ou service n’est ajouté. Par corps, le haut ajoute 576 triangles, les chaussures 480, et le bas ajoute 192 (jupe), 984–1 022 (short) ou 2 330–2 372 (pantalon).

V2.4 : les six styles réutilisent ces vêtements, avec un pull à manches longues de 475 sommets et 768 triangles par corps, généré une fois. Les tissus et couleurs supplémentaires sont calculés dans le shader. Les nouvelles coiffures bouclée et queue de cheval sont des maillages procéduraux liés à l’articulation de la tête ; aucune image générée ou ressource externe n’est utilisée. Les voitures, meubles supplémentaires et copies de la maison d’origine sont créés par le code du projet et leurs géométries sont partagées entre instances.

## Ajouts V2.5

Trois coiffures supplémentaires (carré, longue ondulée, tresses relevées), ajustements de proportions dans le shader, ustensile de cuisine et fauteuil à coussins/pieds : géométrie et code procéduraux originaux, générés localement. Aucune image privée ni ressource téléchargée ajoutée. Les droits CC0 des modèles Quaternius existants restent identiques.

## Refonte V4

Aucun asset externe supplémentaire. Visages paramétrés, accessoires, robe longue, placement analytique des bras, détails d’intérieurs et nouveaux meubles sont du code original ou des adaptations procédurales des modèles CC0 déjà attribués ci-dessus. Les modèles sources Quaternius restent inclus et inchangés. Les rendus de vérification utilisent uniquement des parties synthétiques.

## Ajouts originaux V5

Éclairage/ciel/matières procédurales, géométrie du mobilier arrondi et feuillage, cinq coiffures retravaillées, cols et tabliers : code et géométrie produits dans ce dépôt, sans nouveau modèle ou texture téléchargé. Les humains CC0 ci-dessus restent la base. Aucun fichier de sauvegarde personnelle ni capture privée n’est inclus.

## V6 — vie de foyer

Calottes de coiffure dérivées de la surface du modèle Quaternius CC0 déjà inclus, avec découpe et décalage des normales ; autres volumes de cheveux, tenues, cloisons, lits, poussette, jouets et éclairage créés en code original pour ce projet. Textes de dialogue et personnages secondaires prédéfinis originaux. Aucun asset ni service externe supplémentaire. Aucun fichier personnel, photo reçue ou sauvegarde privée ajouté au dépôt.

## V7 — réutilisation du mobilier

Aucune nouvelle ressource externe. Le lit, le canapé et la table/chaises procéduraux existants sont classés avant regroupement pour être dessinés à une autre position/orientation. Pieds de chaises et retouches de coussins originaux ; hauteur de sommeil corrigée. Licence des modèles humains inchangée.

## V8 — vêtements et expressions

Aucune ressource externe nouvelle. Les nouveaux hauts sont découpés et légèrement élargis depuis la surface skinnée CC0 existante ; les chaussons sont procéduraux. Sommets de vêtements quantifiés identiques regroupés sans changer les triangles, pour limiter le coût GPU. Lèvres/sourcils/sourire et cadres de scènes créés dans le moteur existant. Textes RP écrits dans le projet, sans téléchargement ni génération distante.

## V11 — morphologies d’âge

Bébés, enfants et aînés : huit bases MakeHuman CC0 au total (femme/homme × bébé/enfant/jeune/aîné), même dépôt et commit épinglé que V10. Le manifeste `tools/character-sources.json` contient les 38 fichiers graphiques précis et leurs SHA-256. Les 24 cibles supplémentaires sont les six mélanges ethniques et deux moyennes universelles pour chacun des trois âges. Aucun code MakeHuman AGPL inclus ou exécuté. Conversion originale via NumPy, SciPy et fast-simplification, hors jeu.

Bases adultes : 14 172 triangles et 241 188 octets binaires chacune. Chaque base d’âge : 7 172 triangles et 122 188 octets. Géométrie d’âge, mains corrigées, tenues, cheveux, marques d’âge, école, atelier, appartements et voitures réalisés/adaptés localement. Les modèles d’âge et leurs coiffures sont transférés au GPU à leur première utilisation puis réutilisés. Aucun asset généré par IA, vidéo personnelle ou photo privée ajouté.

## V12 — géométrie conservée et direction artistique

Même source CC0 épinglée et même manifeste SHA-256 que V11. La tête conserve désormais les faces source ; seul le reste du corps est simplifié avec frontière du cou préservée. Adultes : 14 172 triangles avec yeux, 242 596 / 242 420 octets binaires ; âges : 10 172–11 010 triangles et 175 036–189 018 octets. Asset JavaScript total : 2 133 991 octets. Aucune nouvelle dépendance de rendu.

Meubles, mèches courbes, feuillage en cartes géométriques et matières par shader sont des créations procédurales originales. Aucun asset externe supplémentaire, aucune sauvegarde ou capture personnelle publié.
