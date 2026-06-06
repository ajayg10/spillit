CREATE TABLE IF NOT EXISTS votes (
    id                BIGSERIAL PRIMARY KEY,
    post_id           BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    voter_fingerprint VARCHAR(64) NOT NULL,
    vote_type         SMALLINT NOT NULL CHECK (vote_type IN (1, -1)),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT votes_unique_voter UNIQUE (post_id, voter_fingerprint)
);
