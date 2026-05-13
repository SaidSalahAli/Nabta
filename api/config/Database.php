<?php

namespace Nabta\Config;

use PDO;
use PDOException;

/**
 * Database Connection Manager
 * Handles all database operations with security best practices
 */
class Database
{
    private static ?PDO $connection = null;
    private string $host;
    private string $db;
    private string $user;
    private string $password;
    private string $charset;

    public function __construct()
    {
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->db = getenv('DB_DATABASE') ?: 'nabta_db';
        $this->user = getenv('DB_USERNAME') ?: 'root';
        $this->password = getenv('DB_PASSWORD') ?: '';
        $this->charset = getenv('DB_CHARSET') ?: 'utf8mb4';
    }

    /**
     * Get singleton database connection
     */
    public function connect(): PDO
    {
        if (self::$connection === null) {
            try {
                $dsn = "mysql:host={$this->host};dbname={$this->db};charset={$this->charset}";
                
                self::$connection = new PDO(
                    $dsn,
                    $this->user,
                    $this->password,
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false,
                        PDO::ATTR_PERSISTENT => false,
                    ]
                );
            } catch (PDOException $e) {
                logError('Database Connection Error: ' . $e->getMessage());
                throw new PDOException('Database connection failed: ' . $e->getMessage());
            }
        }

        return self::$connection;
    }

    /**
     * Close database connection
     */
    public static function close(): void
    {
        self::$connection = null;
    }

    /**
     * Begin transaction
     */
    public function beginTransaction(): bool
    {
        return $this->connect()->beginTransaction();
    }

    /**
     * Commit transaction
     */
    public function commit(): bool
    {
        return $this->connect()->commit();
    }

    /**
     * Rollback transaction
     */
    public function rollback(): bool
    {
        return $this->connect()->rollBack();
    }

    /**
     * Execute raw query with prepared statements
     */
    public function query(string $sql, array $params = []): \PDOStatement
    {
        $stmt = $this->connect()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    /**
     * Fetch all records
     */
    public function fetchAll(string $sql, array $params = []): array
    {
        return $this->query($sql, $params)->fetchAll();
    }

    /**
     * Fetch single record
     */
    public function fetch(string $sql, array $params = [])
    {
        return $this->query($sql, $params)->fetch();
    }

    /**
     * Get last inserted ID
     */
    public function lastInsertId(): string
    {
        return $this->connect()->lastInsertId();
    }

    /**
     * Get connection instance
     */
    public function getPDO(): PDO
    {
        return $this->connect();
    }
}
