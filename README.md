# Plateforme d'Apprentissage en Ligne - API Backend

Cette API sert de backend à une plateforme d'apprentissage en ligne. Elle utilise une architecture moderne avec MongoDB pour le stockage persistant et Redis pour le cache.

## Installation

1. Cloner le repository :
```bash
git clone https://github.com/jaouad4/learning-platform-nosql.git
cd learning-platform-nosql
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
   Créer un fichier `.env` à la racine du projet avec :
```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=elearning
REDIS_URI=redis://localhost:6379
PORT=3000
```

4. Lancer l'application :
```bash
npm start
```

## Structure du Projet

```
.
├── app.js                 # Point d'entrée de l'application
├── config/               
│   ├── db.js             # Configuration des connexions aux bases de données
│   └── env.js            # Gestion des variables d'environnement
├── controllers/          
│   └── courseController.js # Logique métier des routes
├── routes/               
│   └── courseRoutes.js    # Définition des routes
└── services/             
    ├── mongoService.js    # Services pour MongoDB
    └── redisService.js    # Services pour Redis
```

## Choix Techniques

### 1. Architecture en Couches
- **Routes** : Définition des endpoints de l'API
- **Contrôleurs** : Logique métier et gestion des requêtes/réponses
- **Services** : Logique réutilisable et abstraction des accès aux données
- **Config** : Configuration et initialisation des composants

### 2. Bases de données
- **MongoDB** : Stockage principal des données (documents flexibles)
- **Redis** : Cache pour optimiser les performances

### 3. Gestion des erreurs
- Validation des variables d'environnement au démarrage
- Gestion des connexions avec retry
- Arrêt gracieux du serveur

## Réponses aux Questions

### Point d'Entrée (app.js)
**Q: Comment organiser le point d'entrée de l'application ?**  
Le point d'entrée est organisé de manière asynchrone avec une fonction `startServer()` qui :
- Initialise les connexions aux bases de données
- Configure l'application Express
- Monte les routes
- Gère les erreurs de démarrage

**Q: Quelle est la meilleure façon de gérer le démarrage ?**  
Utiliser une fonction asynchrone permet de :
- Attendre que toutes les initialisations soient terminées
- Gérer proprement les erreurs de démarrage
- Assurer un ordre précis dans l'initialisation des composants

### Configuration des Bases de Données (db.js)
**Q: Pourquoi créer un module séparé pour les connexions ?**
- Séparation des responsabilités
- Réutilisation des connexions
- Gestion centralisée des erreurs de connexion
- Facilite les tests et le mocking

**Q: Comment gérer proprement la fermeture des connexions ?**
- Écouter les signaux de terminaison (SIGTERM)
- Fermer les connexions dans un ordre précis
- Attendre la fin des opérations en cours
- Logger les étapes de fermeture

### Variables d'Environnement (env.js)
**Q: Pourquoi valider les variables d'environnement au démarrage ?**
- Détection précoce des erreurs de configuration
- Évite les erreurs en production
- Message d'erreur explicite pour faciliter le débogage

**Q: Que se passe-t-il si une variable requise est manquante ?**
- L'application ne démarre pas
- Un message d'erreur explicite indique la variable manquante
- Évite les comportements inattendus en production

### Contrôleurs et Routes
**Q: Quelle est la différence entre un contrôleur et une route ?**
- **Routes** : Définissent les endpoints et leurs méthodes HTTP
- **Contrôleurs** : Contiennent la logique métier et la manipulation des données

**Q: Pourquoi séparer la logique métier des routes ?**
- Meilleure maintenabilité
- Réutilisation de la logique
- Facilite les tests unitaires
- Séparation claire des responsabilités

### Services
**Q: Pourquoi créer des services séparés ?**
- Abstraction de la logique d'accès aux données
- Code réutilisable entre différents contrôleurs
- Facilite les tests et le mocking
- Permet de changer l'implémentation sans affecter les contrôleurs

**Q: Comment gérer efficacement le cache avec Redis ?**
- Définir une stratégie de cache claire (TTL, clés)
- Gérer les invalidations de cache
- Utiliser des patterns comme le cache-aside
- Monitorer l'utilisation du cache

**Q: Quelles sont les bonnes pratiques pour les clés Redis ?**
- Utiliser des préfixes pour organiser les clés
- Inclure la version des données dans la clé
- Définir une convention de nommage claire
- Gérer la durée de vie (TTL) de manière cohérente

## Prochaines Étapes

1. Implémenter les TODOs dans chaque fichier
2. Ajouter des tests unitaires
3. Mettre en place un système de logging
4. Ajouter une documentation API (Swagger/OpenAPI)
5. Configurer un pipeline CI/CD