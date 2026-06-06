package config

import (
    "log"
    "os"
    "strconv"

    "github.com/joho/godotenv"
)

type Config struct {
    Port           string
    DatabaseURL    string
    JWTSecret      string
    DailySalt      string
    RateLimitRPS   int
    AllowedOrigins string
}

func Load() *Config {
    // In dev, load .env file. In Docker, env vars are injected directly.
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found — using environment variables")
    }

    rps, err := strconv.Atoi(getEnv("RATE_LIMIT_RPS", "20"))
    if err != nil {
        rps = 20
    }

    return &Config{
        Port:           getEnv("PORT", "8080"),
        DatabaseURL:    mustGetEnv("DATABASE_URL"),
        JWTSecret:      mustGetEnv("JWT_SECRET"),
        DailySalt:      mustGetEnv("DAILY_SALT"),
        RateLimitRPS:   rps,
        AllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:5173"),
    }
}

func getEnv(key, fallback string) string {
    if v, ok := os.LookupEnv(key); ok {
        return v
    }
    return fallback
}

func mustGetEnv(key string) string {
    v, ok := os.LookupEnv(key)
    if !ok || v == "" {
        log.Fatalf("FATAL: required environment variable %q is not set", key)
    }
    return v
}