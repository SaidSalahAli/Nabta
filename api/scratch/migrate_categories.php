<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Nabta\Config\Config;
use Nabta\Config\Database;

define('BASE_PATH', dirname(__DIR__));
Config::load(BASE_PATH);

try {
    $db = new Database();
    // Check if column already exists
    $columns = $db->fetchAll("SHOW COLUMNS FROM categories LIKE 'cover_image'");
    if (empty($columns)) {
        $db->query("ALTER TABLE categories ADD COLUMN cover_image VARCHAR(500) AFTER icon_url");
        echo "Success: cover_image added to categories\n";
    } else {
        echo "Info: cover_image column already exists\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
