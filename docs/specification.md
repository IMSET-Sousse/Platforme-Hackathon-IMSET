# Exigences Fonctionnelles pour Platforme Hackathon IMSET (POC)

Étant donné qu'il s'agit d'un POC à construire en une journée, nous devons prioriser les fonctionnalités essentielles, tout en assurant une implémentation rapide et fonctionnelle. Voici les exigences détaillées, adaptées aux besoins et inspirées de la Nuit de l'Info :

## 1. Authentification avec GitHub

**Description :** Tous les utilisateurs doivent se connecter via leur compte GitHub, utilisant OAuth pour une authentification sécurisée.

**Détails :** Chaque utilisateur est identifié par son compte GitHub, permettant une intégration directe avec les dépôts pour le suivi des commits. Cela garantit que les équipes peuvent associer leurs dépôts publics ou accessibles pour le leaderboard.

**Impact :** Simplifie l'accès et réduit les besoins de gestion d'utilisateurs, tout en facilitant l'intégration avec GitHub pour le classement.

## 2. Gestion des Équipes

**Description :** Les utilisateurs peuvent créer ou rejoindre des équipes, avec un chef d'équipe pour gérer les membres.

**Détails :** Chaque équipe doit avoir un identifiant unique et être associée à un dépôt GitHub public. Le chef d'équipe peut ajouter ou retirer des membres, avec une limite maximale (par exemple, 5 membres) pour simplifier le POC.

**Impact :** Permet une organisation claire des participants, essentielle pour le suivi des activités et des soumissions.

## 3. Gestion des Défis via Django Admin

**Description :** Les organisateurs créent, modifient et suppriment les défis via l'interface Django admin.

**Détails :** Chaque défi inclut une description, des exigences, et éventuellement des catégories. Les défis sont invisibles pour les équipes jusqu'à T0, moment où ils sont publiés simultanément. Cela utilise l'interface admin de Django pour une gestion rapide et efficace.

**Impact :** Facilite la préparation par les organisateurs, avec une interface familière et rapide à implémenter.

## 4. Distribution et Sélection des Défis

**Description :** À l'instant T0, tous les défis sont publiés simultanément, et les équipes peuvent en choisir jusqu'à 5.

**Détails :** Après T0, les équipes accèdent à la liste des défis via l'interface frontend. Elles peuvent sélectionner jusqu'à 5 défis dans une fenêtre temporelle définie (par exemple, 1 heure après T0). La plateforme valide que le nombre de sélections ne dépasse pas 5, avec une interface simple pour la sélection.

**Impact :** Reproduit une fonctionnalité clé de la Nuit de l'Info, adaptée à notre besoin de simultanéité et de limitation.

## 5. Chronologie du Hackathon avec Compteurs à Rebours

**Description :** La plateforme affiche les phases du hackathon avec des compteurs à rebours pour chaque phase.

**Détails :** Les phases incluent la sélection des défis (de T0 à T1), la période de codage (de T1 à T2), et la soumission (jusqu'à T2). Chaque phase est accompagnée d'un compteur à rebours visible, mis à jour en temps réel via le frontend. Pour le POC, les mises à jour peuvent être périodiques (par exemple, toutes les 5 secondes).

**Impact :** Offre une vue claire du temps restant, essentielle pour les participants et l'affichage en data show.

## 6. Classement Basé sur GitHub (Leaderboard)

**Description :** Le leaderboard classe les équipes en fonction du nombre de commits GitHub et éventuellement d'autres métriques d'interactivité.

**Détails :** La plateforme utilise l'API GitHub pour récupérer les données de commits des dépôts associés aux équipes. Le classement est basé principalement sur le nombre de commits, avec une mise à jour périodique (par exemple, toutes les 5 minutes) pour simplifier le POC. D'autres métriques comme le nombre de contributeurs peuvent être ajoutées si le temps le permet.

**Impact :** Fournit un classement dynamique, aligné sur l'activité réelle des équipes, et visible en temps réel pour le data show.

## 7. Soumission en Ligne des Projets

**Description :** Les équipes soumettent leurs solutions via un lien vers leur dépôt GitHub.

**Détails :** Les soumissions sont associées aux défis sélectionnés et doivent être effectuées avant la date limite (T2). La plateforme vérifie que le lien GitHub est accessible et valide. Pour le POC, une interface simple permet de soumettre le lien, avec une validation basique.

**Impact :** Simplifie le processus de soumission, en s'appuyant sur GitHub pour la gestion des projets.

## 8. Affichage pour Data Show

**Description :** Un tableau de bord dédié affiche en temps réel des informations pour un grand écran.

**Détails :** Le tableau de bord inclut :
- Le classement actuel des équipes.
- La phase actuelle avec compte à rebours.
- Le nombre total d'équipes et de soumissions.

Optimisé pour un affichage sur grand écran, avec des mises à jour périodiques (par exemple, toutes les 5 minutes). Pour le POC, une page HTML simple avec JavaScript peut suffire, comme illustré ci-dessous.
