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
