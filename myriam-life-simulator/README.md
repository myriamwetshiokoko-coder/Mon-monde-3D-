# Myriam Life Simulator 💜

Mini-jeu original en français : **Ma vie, mes règles**, version 4 (29 octobre 2026).

## Jouer
- Page d'accueil : [index.html](./index.html)
- Si GitHub Pages publie la branche `main` depuis la racine, l'adresse publique est :
  https://myriamwetshiokoko-coder.github.io/Mon-monde-3D-/myriam-life-simulator/

## Fonctionnalités de la V1
- Un personnage humain nommé Myriam, personnalisable
- Carrière, études, formations, emploi et revenus
- Entreprises à créer et à développer
- Logement, véhicules, loisirs et événements
- Missions, niveaux et succès
- Sauvegarde automatique avec `localStorage`

## Mettre à jour
Le jeu est autonome : HTML, CSS et JavaScript sont tous dans `index.html`.
Les futures mises à jour doivent modifier uniquement ce sous-dossier afin de ne pas toucher à Mon Monde 3D.
La clé de sauvegarde actuelle est `myriam-life-simulator-v1` ; la conserver pour ne pas réinitialiser les parties existantes.
Tester l'interface iPhone et les sauvegardes avant chaque publication.
La sauvegarde reste dans le navigateur et sur cet appareil (pas de synchronisation en ligne).


## Version 4 — Portraits, rencontres et progression

Cette mise à jour suit trois inspirations de gameplay sans copier leurs éléments graphiques : *Life Sim 3D*, *Family Sim: Life Simulator*, *Business Cat: Life Simulator*.

- **Personnages à l'écran** : nouvelle scène de portrait en 2D enrichie avec la représentation de Myriam et, lorsque présents, le partenaire et l'animal de compagnie à côté d'elle. Il ne s'agit **pas d'un monde 3D exploratoire**. Les portraits restent pour le moment des illustrations vectorielles, et non des modèles photoréalistes.
- **Rencontres ciblées** : 12 profils disponibles, suggestions en fonction du patrimoine fictif (modeste, intermédiaire, aisé) ; possibilité d'afficher librement tous les profils.
- **Carrière profonde** : quatre programmes (formation professionnelle, licence de gestion, master management, MBA/direction). Chaque programme comprend des modules, plusieurs cours et un examen à choix multiples ; les diplômes ouvrent les catégories de métiers et ajoutent les niveaux d'études requis.
- **Économie rééquilibrée** : hausse du prix des logements, véhicules et sociétés, bénéfices passifs recalibrés, récompenses journalières/hebdomadaires réduites, rémunérations de missions ajustées et récompenses de niveaux plafonnées.
- **Rythme de jeu** : une journée de travail, une mission rémunérée, un cours d'étude et une formation de compétence au maximum par jour. Aucune attente en temps réel ; le joueur passe librement au jour suivant.
- **Compatibilité** : les anciennes sauvegardes sont conservées sous la clé `myriam-life-simulator-v1`, avec la section supplémentaire `career4`. Les achats déjà effectués ne sont pas supprimés et le patrimoine existant n'est pas confisqué.
- **Tests** : scripts exécutés pour le quotidien, la famille, les chiens, la rencontre selon richesse, le verrouillage des métiers, l'inscription, les cours/examens, le diplôme, le choix d'un métier et le redémarrage de partie. Les vérifications réelles d'affichage sur Safari iPhone restent à effectuer.

Cette mise à jour change le rythme pour les nouvelles parties, mais les personnages précédemment riches gardent leur capital accumulé.

## Version 3 — Vie de famille et patrimoine (29 octobre 2026)
Inspirations de mécaniques uniquement : *Life Sim 3D*, *Family Sim: Life Simulator* et *Business Cat: Life Simulator*. Aucun graphisme ni code de ces jeux n'a été copié.

- Nouvel onglet **Famille** : rencontre parmi trois personnages fictifs, vie de couple, fiançailles, mariage intime gratuit ou cérémonie payante, séparation possible.
- Projet d'enfant volontaire (jusqu'à trois) : délai de 8 jours, puis bouton de naissance. **Aucun accouchement automatique.**
- Enfants qui grandissent (1 an = 12 jours joués), passent à l'école et deviennent autonomes à 18 ans. Les activités sont financées automatiquement par le foyer, sans demander au joueur de diriger chaque proche.
- Partenaire et proches autonomes : carrière et budget du partenaire distincts du portefeuille de Myriam. Souvenirs enregistrés dans le journal familial.
- Animaux, décoration du foyer, épargne (+1 % tous les 7 jours), fonds de placement **fictif et risqué** avec variation chaque semaine.
- Embauche facultative de responsables d'entreprise : coût unique de 750 DH, +20 % de bénéfices dans l'entreprise concernée.
- Correction de la réinitialisation des objectifs lors d'une nouvelle partie.

### Sécurité de la progression
Le jeu conserve la clé de sauvegarde `myriam-life-simulator-v1` et ajoute des sections facultatives `family3` et `economy3`.
Les données restent dans le navigateur, sur le même appareil. Pour changer de navigateur ou d'appareil, aucun transfert automatique n'est disponible.
La famille et les investissements sont **entièrement optionnels**.
Cette version reste un jeu **2D de gestion et de décisions**, sans mode 3D.

### Vérification
Test de syntaxe JavaScript et simulation des actions : dépôt/retrait, rencontres, mariage, attente de naissance, naissance volontaire, autonomie des proches et nouvelle partie. **La vérification d'affichage et de fluidité sur Safari iPhone reste à faire.**

## Versionnement
- **V1** : première version jouable publiée.
- **V2** : défis, missions rémunérées, messages et histoires.
- **V3** : famille autonome, foyer, enfants, épargne et équipes d'entreprise.
- **V4** : portraits enrichis, rencontres selon patrimoine, diplômes et économie rééquilibrée.
