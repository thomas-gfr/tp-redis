<?php
require 'vendor/autoload.php';

class RedisClient {
    private $redis;

    public function connect() {
        // Configuration du serveur Redis
        $redisConfig = [
            'scheme' => 'tcp',
            'host' => 'redis-11687.c311.eu-central-1-1.ec2.cloud.redislabs.com',
            'port' => 11687,
            'password' => 'ORfcR0jUx9WSPSZ2fXgRrz5WyOtcXIMI',
        ];

        // Connexion à Redis
        $this->redis = new \Predis\Client([
            'scheme' => $redisConfig['scheme'],
            'host' => $redisConfig['host'],
            'port' => $redisConfig['port'],
            'password' => $redisConfig['password']
        ]);

        // Test de connexion à la base de données
        try {
            // Authentification si un mot de passe est défini
            if (!empty($redisConfig['password'])) {
                $this->redis->auth($redisConfig['password']);
            }

            // echo "<button class='alert alert-secondary'> Connexion à la base de données Redis Ok !</button>";
        } catch (Predis\Connection\ConnectionException $e) {
            // Gestion de l'erreur de connexion
            echo "Erreur de connexion à Redis : " . $e->getMessage();
        } catch (Predis\Response\ServerException $e) {
            // Gestion de l'erreur d'authentification
            echo "Erreur d'authentification Redis : " . $e->getMessage();
        } catch (Exception $e) {
            // Gestion d'autres exceptions
            echo "Une erreur s'est produite : " . $e->getMessage();
        }
    }

    public function getClient() {
        if (!$this->redis) {
            $this->connect();
        }
        return $this->redis;
    }
}

// Exemple d'utilisation
$redisClient = new RedisClient();
$redis = $redisClient->getClient();
?>
