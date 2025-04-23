# Spécification Frontend pour la Plateforme Hackathon IMSET

## Charte Graphique

**Polices**:
- Police principale: Roboto
- Police secondaire: Work Sans, sans-serif

**Couleurs**:
- Couleur par défaut: #000000de
- Couleur secondaire/accent: #d7b369
- Couleur des titres: #222222
- Couleur des paragraphes: #8b8b8bde
- Couleur au survol: #d89f2b
- Couleur blanche: #ffffff
- Couleur grise: #b9b9b9
- Couleur noire: #000000
- Couleur des statistiques: #555555
- Couleur HNRS: #710e20de

## Pages à Développer

### 1. Page d'Accueil (Non-Authentifié)

**Objectif**: Présenter la plateforme et rediriger vers l'authentification GitHub.

**Composants**:
- Logo de l'IMSET et du Hackathon (en-tête)
- Titre principal (couleur des titres)
- Description du hackathon (couleur des paragraphes)
- Bouton "Se connecter avec GitHub" (couleur secondaire, survol: couleur hover)
- Compteur à rebours avant le début du hackathon (si applicable)
- Pied de page avec informations de contact et copyright

### 2. Interface d'Authentification GitHub

**Objectif**: Faciliter l'authentification sécurisée via OAuth GitHub.

**Flux**:
- Redirection vers GitHub pour autorisation
- Retour sur la plateforme avec jeton d'accès
- Redirection vers le tableau de bord si connecté avec succès

### 3. Tableau de Bord Principal (Authentifié)

**Objectif**: Hub central pour les participants après connexion.

**Composants**:
- Barre de navigation (fond: blanc, texte: couleur par défaut)
  - Logo (gauche)
  - Menu de navigation (centre)
  - Profil utilisateur (droite)
- Section principale divisée en:
  - État actuel du hackathon (phase, temps restant)
  - Statut de l'équipe (avec actions rapides)
  - Cartes de défis sélectionnés/disponibles
- Compteur à rebours proéminent indiquant le temps restant dans la phase actuelle
- Panneau latéral avec classement simplifié (top 5)

### 4. Gestion d'Équipe

**Objectif**: Création et gestion des équipes par les participants.

**Composants**:
- Formulaire de création d'équipe:
  - Nom d'équipe (requis)
  - Description (optionnel)
  - URL du dépôt GitHub (requis)
- Interface de gestion d'équipe (pour chef d'équipe):
  - Liste des membres avec possibilité d'ajouter/supprimer
  - Lien d'invitation à partager
  - Modification des informations d'équipe
- Vue membre (pour membres non-chef):
  - Informations de l'équipe
  - Liste des membres
  - Option de quitter l'équipe

### 5. Interface de Sélection des Défis

**Objectif**: Permettre aux équipes de consulter et sélectionner jusqu'à 5 défis après T0.

**Composants**:
- Compteur indiquant le temps restant pour la sélection
- Grille de cartes de défis avec:
  - Titre (couleur des titres)
  - Description courte (couleur des paragraphes)
  - Difficulté estimée (indicateur visuel)
  - Bouton de sélection (couleur secondaire)
- Panneau latéral montrant les défis déjà sélectionnés (max 5)
- Bouton de confirmation de sélection finale
- Filtre et recherche des défis

### 6. Interface Détaillée des Défis

**Objectif**: Fournir toutes les informations sur un défi spécifique.

**Composants**:
- En-tête avec titre et catégorie
- Description complète du défi
- Exigences et contraintes
- Ressources recommandées ou fournies
- Bouton d'action (sélectionner/désélectionner selon l'état)
- Lien retour à la liste des défis

### 7. Leaderboard

**Objectif**: Afficher le classement des équipes basé sur l'activité GitHub.

**Composants**:
- Tableau de classement avec:
  - Rang
  - Nom d'équipe
  - Nombre de commits
  - Nombre de contributeurs actifs
  - Score total (calculé selon algorithme défini)
- Filtres par défis sélectionnés
- Visualisation graphique des performances (barres/graphiques)
- Indicateur de la position de l'équipe de l'utilisateur
- Actualisation périodique des données (avec indicateur de dernière mise à jour)

### 8. Interface de Soumission

**Objectif**: Permettre aux équipes de soumettre leurs solutions finales.

**Composants**:
- Formulaire de soumission par défi:
  - Sélection du défi (parmi ceux choisis)
  - URL du dépôt GitHub (pré-rempli avec l'URL de l'équipe)
  - Branche spécifique (optionnel)
  - Description de la solution (limité à 500 caractères)
  - Fichier README spécifique (optionnel)
- Statut des soumissions par défi
- Compteur à rebours jusqu'à la date limite de soumission (T2)

### 9. Tableau de Bord pour Data Show

**Objectif**: Affichage optimisé pour projection sur grand écran lors de l'événement.

**Composants**:
- Mode plein écran automatique
- Affichage en temps réel du classement (top 10)
- Compteur à rebours proéminent
- Statistiques globales:
  - Nombre d'équipes
  - Nombre total de commits
  - Nombre de soumissions
- Rotation automatique des vues:
  - Classement
  - Activité récente (commits/soumissions)
  - Défis les plus populaires
- Optimisation pour lisibilité à distance (grands caractères, contraste élevé)

### 10. Profil Utilisateur

**Objectif**: Gestion des informations personnelles et préférences.

**Composants**:
- Informations de profil GitHub (nom, avatar)
- Équipe actuelle avec option de gestion
- Historique des activités
- Paramètres de notification
- Option de déconnexion

## États du Système et Retour Visuel

- Chargement: Spinner/skeleton avec couleur secondaire
- Succès: Notifications en vert (#4CAF50)
- Erreur: Notifications en couleur HNRS
- Avertissement: Notifications en orange (#FF9800)

## Adaptations Responsives

- **Desktop**: Toutes les fonctionnalités décrites ci-dessus
- **Tablette**: Adaptation des grilles à 2 colonnes, menus condensés
- **Mobile**: Vue simplifiée à 1 colonne, navigation par menu hamburger

## Accessibilité

- Contraste suffisant entre texte et fond
- Alternatives textuelles pour éléments non-textuels
- Navigation possible au clavier
- Support des lecteurs d'écran pour les éléments critiques
