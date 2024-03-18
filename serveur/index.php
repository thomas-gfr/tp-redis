<?php

header("Access-Control-Allow-Origin: http://localhost:3000"); // Remplacez http://localhost:3000 par l'URL de votre Front-end si nécessaire
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

require 'vendor/autoload.php';
require 'RedisClient.php'; // Incluez le fichier RedisClient.php
use Ramsey\Uuid\Uuid;
use Dotenv\Dotenv;

// Chargement des variables d'environnement depuis le fichier .env
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Utilisez les variables d'environnement pour la configuration de la base de données
$databaseUrl = $_ENV['DATABASE_URL'];

// Analysez la chaîne de connexion de la base de données
$dbConfig = parse_url($databaseUrl);    

if ($dbConfig === false) {
    die("Impossible de parser la chaîne de connexion de la base de données.");
}

// Extrayez les informations de la chaîne de connexion
$dbHost = $dbConfig['host'];
$dbPort = $dbConfig['port'];
$dbUser = $dbConfig['user'];
$dbPassword = $dbConfig['pass'];
$dbName = ltrim($dbConfig['path'], '/');

try {
    // Créez une connexion à la base de données MySQL en utilisant PDO
    $pdo = new PDO("mysql:host=$dbHost;port=$dbPort;dbname=$dbName", $dbUser, $dbPassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $redisClient = new RedisClient();
    $redis = $redisClient->getClient();

    class UserManager
    {
        private $pdo;
        private $redis;

        public function __construct($pdo, $redis)
        {
            $this->pdo = $pdo;
            $this->redis = $redis;
        }

        public function createUser($firstName, $lastName, $age, $job, $email, $password, $adresse)
        {
            $uuid = Uuid::uuid4()->toString();

            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            $stmt = $this->pdo->prepare("INSERT INTO users ( password, firstName, lastName, age, job, email, adresse) VALUES ( ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$hashedPassword, $firstName, $lastName, $age, $job, $email, $adresse]);

            // Invalidation du cache Redis après la création
            $this->invalidateCache($uuid);
        }


        public function readUser($uuid)
        {
            $stmt = $this->pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$uuid]);

            $userData = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($userData) {
                unset($userData['password']);
                return $userData;
            } else {
                return null;
            }
        }

        public function updateUser($uuid, $firstName, $lastName, $age, $job, $email, $adresse)
        {
            // $stmt = $this->pdo->prepare("UPDATE users SET username=?, sport=?, tel=?, age=? WHERE id=?");
            $stmt = $this->pdo->prepare("UPDATE users SET firstName=?, lastName=?, age=?, job=?, email=? , adresse=? WHERE id=?");
            // $stmt->execute([$username, $sport, $tel, $age, $uuid]);
            $stmt->execute([$firstName, $lastName, $age, $job, $email, $adresse, $uuid]);

            // Invalidation du cache Redis après la mise à jour
            $this->invalidateCache($uuid);
        }

        public function deleteUser($uuid)
        {
            $stmt = $this->pdo->prepare("DELETE FROM users WHERE id=?");
            $stmt->execute([$uuid]);

            // Invalidation du cache Redis après la suppression
            $this->invalidateCache($uuid);
        }

        public function getAllUsers()
        {
            $stmt = $this->pdo->query("SELECT * FROM users");

            $allUsers = [];

            while ($userData = $stmt->fetch(PDO::FETCH_ASSOC)) {
            //     unset($userData['password']);
                $allUsers[] = $userData;
            }

            return $allUsers;
        }

        // Méthode privée pour invalider le cache Redis
        private function invalidateCache($uuid)
        {
            $this->redis->del("user:$uuid");
        }
    }

    // Définir des routes pour votre API
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // On lit les données de la requête JSON
        $postData = file_get_contents("php://input");
        $userData = json_decode($postData, true);
    
        // On récupère les données
        $firstName = $userData['firstName'] ?? null;
        $lastName = $userData['lastName'] ?? null;
        $age = $userData['age'] ?? null;
        $job = $userData['job'] ?? null;
        $email = $userData['email'] ?? null;
        $password = $userData['password'] ?? null;
        $adresse = $userData['adresse'] ?? null;
    
        // Vérifie si des champs sont vides
        if (empty($firstName) || empty($lastName) || empty($age) || empty($job) || empty($email) || empty($password) || empty($adresse)) {
            http_response_code(400);
            echo json_encode(['message' => 'Veuillez remplir tous les champs']);
            exit();
        }
    
        // Instancie le gestionnaire d'utilisateurs
        $userManager = new UserManager($pdo, $redis);
    
        // Crée l'utilisateur
        $userManager->createUser($firstName, $lastName, $age, $job, $email, $password, $adresse);
    
        // Renvoie une réponse JSON
        echo json_encode(['message' => 'Utilisateur créé avec succès']);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['uuid'])) {
        $userManager = new UserManager($pdo, $redis);
        $uuid = $_GET['uuid'];

        $userData = $userManager->readUser($uuid);
        if ($userData) {
            header('Content-Type: application/json');
            echo json_encode($userData);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'L\'utilisateur n\'existe pas']);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($_GET['modifyUser'])) {
        // On lit les données de la requête JSON
        $putData = file_get_contents("php://input");
        $userData = json_decode($putData, true);
    
        // On vérifie si les données nécessaires sont présentes
        if (
            isset($userData['id']) &&
            isset($userData['firstName']) &&
            isset($userData['lastName']) &&
            isset($userData['age']) &&
            isset($userData['job']) &&
            isset($userData['email'])
        ) {
            // On récupère les données
            $uuid = $userData['id'];
            $firstName = $userData['firstName'];
            $lastName = $userData['lastName'];
            $age = $userData['age'];
            $job = $userData['job'];
            $email = $userData['email'];
            $adresse = $userData['adresse'];
    
            // On instancie le gestionnaire d'utilisateurs
            $userManager = new UserManager($pdo, $redis);
    
            // On met à jour l'utilisateur
            $userManager->updateUser($uuid, $firstName, $lastName, $age, $job, $email, $adresse);
    
            // On renvoie une réponse JSON
            echo json_encode(['message' => 'Utilisateur mis à jour avec succès']);
        } else {
            // On renvoie une erreur
            http_response_code(400);
            echo json_encode(['message' => 'Données manquantes']);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Récupère le chemin de l'URL
        $requestUri = $_SERVER['REQUEST_URI'];
    
        // Sépare le chemin en segments
        $segments = explode('/', $requestUri);
    
        // Le dernier segment est l'identifiant de l'utilisateur
        $userId = end($segments);
    
        // Vérifie si l'identifiant de l'utilisateur est numérique
        if (is_numeric($userId)) {
            // On instancie le gestionnaire d'utilisateurs
            $userManager = new UserManager($pdo, $redis);
    
            // On supprime l'utilisateur
            $userManager->deleteUser($userId);
    
            // On renvoie une réponse JSON
            echo json_encode(['message' => 'Utilisateur supprimé avec succès']);
        } else {
            // L'identifiant de l'utilisateur n'est pas valide
            http_response_code(400);
            echo json_encode(['message' => 'Identifiant utilisateur invalide']);
        }
    }elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['all'])) {
        $userManager = new UserManager($pdo, $redis);

        $allUsers = $userManager->getAllUsers();

        if (!empty($allUsers)) {
            header('Content-Type: application/json');
            echo json_encode($allUsers);
        } else {
            http_response_code(404);
            echo json_encode(['message' => 'Aucun utilisateur trouvé']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'Requête invalide']);
    }
} catch (PDOException $e) {
    die("Erreur lors de la connexion à la base de données : " . $e->getMessage());
}
