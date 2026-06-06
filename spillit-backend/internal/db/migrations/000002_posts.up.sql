CREATE TABLE IF NOT EXISTS posts (
    id           BIGSERIAL PRIMARY KEY,
    pseudonym_id BIGINT REFERENCES pseudonyms(id) ON DELETE SET NULL,
    content      TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
    category     VARCHAR(20) NOT NULL CHECK (category IN
                   ('confession','college','relationships','career','random')),
    is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
    upvotes      INT NOT NULL DEFAULT 0,
    downvotes    INT NOT NULL DEFAULT 0,
    real_votes   INT NOT NULL DEFAULT 0,
    cap_votes    INT NOT NULL DEFAULT 0,
    report_count INT NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_feed     ON posts(created_at DESC)           WHERE report_count < 10;
CREATE INDEX idx_posts_category ON posts(category, created_at DESC) WHERE report_count < 10;
CREATE INDEX idx_posts_score    ON posts((upvotes - downvotes) DESC);
