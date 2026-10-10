# Ressources 3D de la V2.2

Modèles et trois coiffures adaptés du pack **Universal Base Characters — Standard**, par Quaternius.

Source officielle : https://quaternius.com/packs/universalbasecharacters.html
Téléchargement officiel : https://quaternius.itch.io/universal-base-characters
Licence : **CC0 1.0 Universal**, https://creativecommons.org/publicdomain/zero/1.0/

Archive gratuite obtenue le 10 octobre 2026 : `Universal Base Characters[Standard].zip`. Le fichier `License_Standard.txt` confirme CC0 pour cette version. Aucune ressource de la version Source payante n’est incluse.

Éléments utilisés : `Superhero_Female_FullBody`, `Superhero_Male_FullBody`, `Hair_BuzzedFemale`, `Hair_Buns`, `Hair_Long` (glTF). Modifications : quantification, regroupement de 65 articulations en 21 (doigts rigidement attachés aux mains), inversion de l’axe Z, réduction des attributs et suppression des textures. Vêtements/teints/couleurs et poses sont pilotés par le moteur du jeu. Les animations originales du pack ne sont pas utilisées ; les poses sont calculées par le jeu.

`assets/humans.js` contient environ 1 Mo de données locales : deux corps, yeux, sourcils, coiffures. 8 844 sommets / 15 060 triangles pour le modèle féminin ; 8 483 sommets / 14 318 triangles pour le masculin. Les coiffures ajoutent 830 à 3 284 triangles. Aucun téléchargement externe n’a lieu pendant le jeu.

Reconstruction : `python3 tools/build_characters.py /chemin/vers/le/pack-extrait`. Ce script nécessite NumPy uniquement lors de la préparation. Les modèles non sélectionnés et l’archive complète ne sont pas ajoutés au dépôt.

Le quartier, les accessoires, les couleurs, les sons et les maillages de secours restent ceux du projet.
