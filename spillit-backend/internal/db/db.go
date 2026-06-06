package db

import (
    "context"
    "fmt"
    "log"

    "github.com/jackc/pgx/v5/pgxpool"
)

// New creates a *pgxpool.Pool — a thread-safe connection pool.
// pgxpool manages idle connections so goroutines don't block waiting for a DB handle.
func New(ctx context.Context, databaseURL string) (*pgxpool.Pool, error) {
    cfg, err := pgxpool.ParseConfig(databaseURL)
    if err != nil {
        return nil, fmt.Errorf("db: parse config: %w", err)
    }

    // Tuning: enough connections for concurrent requests without starving Postgres
    cfg.MaxConns = 25
    cfg.MinConns = 5

    pool, err := pgxpool.NewWithConfig(ctx, cfg)
    if err != nil {
        return nil, fmt.Errorf("db: create pool: %w", err)
    }

    // Verify connectivity at startup — fail fast if DB is unreachable
    if err := pool.Ping(ctx); err != nil {
        return nil, fmt.Errorf("db: ping failed: %w", err)
    }

    log.Println("Database connection pool established")
    return pool, nil
}