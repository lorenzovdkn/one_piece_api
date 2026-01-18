# One Piece API

Une API pour gérer une collection de cartes de personnages One Piece, avec un système complet d'authentification et de gestion des decks.

**Frontend** : [github.com/lorenzovdkn/one-piece-tgc](https://github.com/lorenzovdkn/one-piece-tgc)

## Vue d'ensemble

**One Piece API** est une API backend conçue pour gérer une application fullstack de collection de cartes. Elle offre :

- CRUD complet pour les cartes avec gestion des types
- Authentification JWT sécurisée
- Gestion des utilisateurs avec bcrypt
- Système de decks personnalisés
- Documentation Swagger intégrée
- Suite de tests complète avec 100% de coverage

## Stack technologique

| Technologie | Utilisation |
|------------|------------|
| **Node.js / Express.js** | Serveur backend |
| **TypeScript** | Typage statique et sécurité du code |
| **Prisma ORM** | Gestion de la base de données |
| **SQLite** | Base de données relationnelle |
| **JWT** | Authentification sécurisée |
| **bcrypt** | Hachage des mots de passe |
| **Jest / Supertest** | Tests d'intégration |
| **Swagger/OpenAPI** | Documentation interactive |

## Installation et démarrage

### Prérequis
- Node.js (LTS)
- npm ou yarn
- Git

### Étapes d'installation

```bash
# Cloner le repository
git clone <repository-url>
cd one_piece_api

# Installer les dépendances
npm ci

# Configurer les variables d'environnement
# Créer un fichier .env basé sur .env.example (déjà configuré)

# Initialiser la base de données + Peupler la BD avec les données initiales
npm run db:reset

# Lancer le serveur en mode développement
npm run dev
```

Le serveur démarre sur `http://localhost:3000`  
Documentation Swagger disponible sur `http://localhost:3000/api-docs`

## Scripts disponibles

```bash
npm run dev              # Serveur en mode développement (hot-reload)
npm run build           # Compiler le TypeScript en JavaScript
npm run start           # Lancer le serveur en production
npm run type-check      # Vérifier les types TypeScript
npm run test            # Exécuter les tests d'intégration
npm run test:coverage   # Tests avec rapport de couverture
npm run db:migrate      # Appliquer les migrations Prisma
npm run db:reset        # Réinitialiser la BD complètement
npm run db:studio       # Ouvrir l'interface graphique Prisma
npm run lint            # Vérifier la qualité du code
```

## Qualité et Tests

### Couverture de tests

L'API inclut une suite complète de tests d'intégration utilisant **Jest** et **Supertest** :

- **100% de couverture** : Tous les endpoints testés
- **Validation des codes HTTP** : 200, 201, 400, 401, 404
- **Validation des réponses** : Structure et contenu des payloads
- **Tests de sécurité** : Authentification, autorisation
- **Cas d'erreur** : Doublets, champs manquants, types invalides

```bash
npm run test              # Exécuter les tests
npm run test:coverage    # Générer le rapport de couverture
```

### Gestion des erreurs

Implémentation complète avec codes HTTP appropriés :

| Code | Situation |
|------|-----------|
| **200** | Succès de la requête |
| **201** | Création réussie |
| **400** | Données invalides, doublet, champ manquant |
| **401** | Token manquant ou invalide |
| **404** | Ressource non trouvée |

Chaque réponse d'erreur contient un message clair et explicite.