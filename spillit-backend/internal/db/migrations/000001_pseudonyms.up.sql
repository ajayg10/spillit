CREATE TABLE IF NOT EXISTS pseudonyms (
    id           BIGSERIAL PRIMARY KEY,
    token_hash   VARCHAR(64) UNIQUE NOT NULL,
    display_name VARCHAR(32) NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
