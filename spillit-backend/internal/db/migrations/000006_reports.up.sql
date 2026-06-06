CREATE TABLE IF NOT EXISTS reports (
    id         BIGSERIAL PRIMARY KEY,
    post_id    BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    comment_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    reason     VARCHAR(32) NOT NULL CHECK (reason IN
                 ('spam','harassment','misinformation','nsfw','other')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NOT NULL)
    )
);
