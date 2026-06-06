CREATE TABLE IF NOT EXISTS comments (
    id           BIGSERIAL PRIMARY KEY,
    post_id      BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    pseudonym_id BIGINT REFERENCES pseudonyms(id) ON DELETE SET NULL,
    content      TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
    comment_type VARCHAR(8) NOT NULL CHECK (comment_type IN ('advice','support','roast')),
    is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON comments(post_id, created_at ASC);
