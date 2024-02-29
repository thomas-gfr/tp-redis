# RedisWebAppAngularProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Description technique
Techno utilisé pour le projet : 
    - Angular 17 pour le front
    - Simple script php avec redis pour le back

## Description fonctionnelle
L'application va lister des utilisateurs avec la possibilité d'en ajouter, de modifier et de supprimer un utilisateur.

## Diagrammes

-Use Case

![USECASE](https://github.com/thomas-gfr/tp-redis/assets/57356412/5a737658-199a-4aa7-a41a-0f7e0288e026)

- Diagramme d'Activité

![activite (1)](https://github.com/thomas-gfr/tp-redis/assets/57356412/92c181cf-9047-40eb-a8f7-6acad403320d)
    
- Diagramme de Flux de Données

![flux](https://github.com/thomas-gfr/tp-redis/assets/57356412/ad8bfa47-4d87-4d83-aa15-bcc345850d54)



## Architecture:
    - Côté Front-end (Angular):
        - Composants Angular:
            - ListeUtilisateursComponent: Affiche la liste des utilisateurs.
            - AjoutUtilisateurComponent: Permet d'ajouter un nouvel utilisateur.
            - DetailsUtilisateurComponent: Affiche les détails d'un utilisateur.
            - ModificationUtilisateurComponent: Permet de modifier les informations d'un utilisateur.
        - Services Angular:
            - UserService: Gère les appels API pour les opérations CRUD d'utilisateurs.
        - Angular Router:
            - Gère la navigation entre les différents composants.
        - Angular HTTP Client:
            - Effectue des requêtes HTTP vers le back-end pour récupérer ou modifier les données des utilisateurs.
    - Côté Back-end (PHP):
        - Contrôleurs PHP:
            - UserController: Traite les requêtes HTTP liées aux utilisateurs.
        - Base de données MySQL:
            - Stocke les données des utilisateurs.
        - Redis Cache:
            - Utilisé pour mettre en cache les données fréquemment accédées et réduire la charge sur la base de données.


## Explication Technique:
    - Front-end Angular:
        - Utilise Angular pour créer une interface utilisateur réactive et dynamique.
        - Utilise le service UserService pour communiquer avec l'API back-end.
        - Utilise le router Angular pour naviguer entre les différentes vues.

    - Back-end PHP:
        - Expose des API RESTful pour gérer les opérations CRUD sur les utilisateurs.
        - Utilise Redis pour le caching afin d'améliorer les performances en réduisant les requêtes à la base de données.
        - Interagit avec la base de données MySQL pour stocker et récupérer les données des utilisateurs.
    
    - Communication entre Front-end et Back-end:
        - Le front-end envoie des requêtes HTTP (GET, POST, PUT, DELETE) à l'API back-end pour effectuer des opérations CRUD.
        - L'API back-end traite ces requêtes, effectue les opérations nécessaires sur la base de données et renvoie les réponses appropriées au front-end.


En utilisant cette architecture et ces choix technologiques, nous pouvons créer un système de gestion d'utilisateurs robuste et évolutif, avec une séparation claire des préoccupations entre le front-end et le back-end.

### Estimation des coûts sur AWS:

#### Front-end (Angular):
- Étant donné qu'Angular est une application front-end, il peut être déployé sur un service de stockage statique tel que Amazon S3.
- Coût estimé : Peu élevé, généralement quelques centimes à quelques dollars par mois en fonction du stockage et de la bande passante utilisés.

#### Back-end (PHP):
- Pour le back-end PHP, nous utiliserons probablement une instance EC2 pour héberger l'API.
- Type d'instance EC2 : T2.micro ou T3.micro (pour les petites charges de travail) ou des instances de la famille Amazon EC2 A1 (utilisant des processeurs Graviton).
- Coût estimé : Environ 10 à 20 dollars par mois pour une instance EC2 de petite taille, selon la région et le type d'instance choisis.

#### Base de données (MySQL) :
- Utilisation d'Amazon RDS pour héberger la base de données MySQL.
- Type d'instance RDS : db.t2.micro ou db.t3.micro (pour des charges de travail légères).
- Coût estimé : Environ 15 à 20 dollars par mois pour une instance RDS de petite taille.

#### Cache (Redis) :
- Utilisation d'Amazon ElastiCache pour héberger Redis.
- Type d'instance ElastiCache : Cache.t2.micro ou cache.t3.micro (pour des charges de travail légères).
- Coût estimé : Environ 10 à 15 dollars par mois pour une petite instance ElastiCache.

### Total estimé :
- Front-end (Angular) : quelques centimes à quelques dollars par mois
- Back-end (EC2) : 10 à 20 dollars par mois
- Base de données (RDS) : 15 à 20 dollars par mois
- Cache (ElastiCache) : 10 à 15 dollars par mois