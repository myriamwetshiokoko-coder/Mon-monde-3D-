# Vérifications V1.0 — 10 octobre 2026

Commande : `node tests/simulation.test.cjs` (Node 24).

**11 tests passés.**

1. Migration V0.2 et bornage des données invalides.
2. Cuisine, repas, achats et refus lorsque les ressources manquent.
3. Limite quotidienne du service au café et sommeil passant minuit.
4. Plafond d’amitié et aller-retour JSON de sauvegarde.
5. Initialisation des quatre modules et deux frames avec un DOM/WebGL simulé ; sauvegarde V0.2 préservée.
6. Collisions des murs, meubles, limites et porte ouverte/fermée.
7. Accessibilité de toutes les activités depuis la maison.
8. Accessibilité continue du café, de l’épicerie, du parc et du retour à la maison.
9. Patrouilles des trois habitants pendant cinq minutes simulées, sans collision ni immobilisation.
10. Annulation sans transaction et simulation suspendue lorsque l’onglet est masqué.
11. Mise à jour du portefeuille/social et regroupement de la géométrie statique.

17 585 positions atteignables dans une grille de 0,4 m, avec vérification des segments intermédiaires. Les tests de trajectoire utilisent la même règle de collision que le jeu. Cela ne remplace pas la manipulation des commandes dans un navigateur.

Contrôle syntaxique : les quatre modules passent `node --check`.

## Limites de vérification

Aucun navigateur de test pris en charge n’était disponible dans cet environnement. Le DOM et WebGL des tests sont simulés : ils ne compilent pas réellement les shaders et ne permettent pas de valider l’image, les événements tactiles natifs ou le GPU. Pas de mesure FPS ni de test Safari/iPhone physique. Le rendu et les performances sont donc **à valider**, avant de considérer cette V1.0 comme une version définitive.

## Recette Safari à réaliser

- Démarrer/reprendre, personnaliser teint, tenue, coiffure et visage.
- Marcher autour des meubles ; sortir et revenir par la porte et le portail.
- Entrer dans les deux commerces, acheter, cuisiner, manger, travailler.
- Parler aux trois habitants ; vérifier besoins et relation.
- Dormir, se laver, annuler une activité.
- Mettre Safari en arrière-plan, reprendre, recharger et retrouver la sauvegarde.
- Exporter/restaurer ; jouer en portrait et paysage ; ajuster la résolution si nécessaire.

La branche publiée actuelle n’a pas été remplacée.
