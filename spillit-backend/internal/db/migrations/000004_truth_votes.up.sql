CREATE TABLE IF NOT EXISTS truth_votes (
    id                BIGSERIAL PRIMARY KEY,
    post_id           BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    voter_fingerprint VARCHAR(64) NOT NULL,
    verdict           VARCHAR(4) NOT NULL CHECK (verdict IN ('real', 'cap')),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT truth_unique_voter UNIQUE (post_id, voter_fingerprint)
);
