package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"spillit-backend/internal/model"
)

type PostRepo struct {
	db *pgxpool.Pool
}

func NewPostRepo(db *pgxpool.Pool) *PostRepo {
	return &PostRepo{db: db}
}

// Create inserts a new post and returns it with the generated ID and timestamp.
func (r *PostRepo) Create(ctx context.Context, req model.CreatePostRequest) (*model.Post, error) {
	// Default is_anonymous to true if not provided
	isAnon := true
	if req.IsAnonymous != nil {
		isAnon = *req.IsAnonymous
	}

	query := `
	INSERT INTO posts (content, category, is_anonymous)
	VALUES ($1, $2, $3)
	RETURNING id, content, category, is_anonymous, upvotes, downvotes, real_votes, cap_votes, created_at
	`

	var post model.Post
	err := r.db.QueryRow(ctx, query, req.Content, req.Category, isAnon).Scan(
		&post.ID,
		&post.Content,
		&post.Category,
		&post.IsAnonymous,
		&post.Upvotes,
		&post.Downvotes,
		&post.RealVotes,
		&post.CapVotes,
		&post.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &post, nil
}

// GetByID fetches a single post by its ID.
func (r *PostRepo) GetByID(ctx context.Context, id int64) (*model.Post, error) {
	query := `
	SELECT id, pseudonym_id, content, category, is_anonymous,
	       upvotes, downvotes, real_votes, cap_votes, created_at
	FROM posts
	WHERE id = $1 AND report_count < 10
	`

	var post model.Post
	err := r.db.QueryRow(ctx, query, id).Scan(
		&post.ID,
		&post.PseudonymID,
		&post.Content,
		&post.Category,
		&post.IsAnonymous,
		&post.Upvotes,
		&post.Downvotes,
		&post.RealVotes,
		&post.CapVotes,
		&post.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &post, nil
}

// ListLatest returns paginated posts sorted by newest first.
// cursor is the last-seen post ID (0 for first page).
func (r *PostRepo) ListLatest(ctx context.Context, category string, cursor int64, limit int) ([]model.Post, error) {
	var query string
	var args []any

	if category != "" {
		if cursor > 0 {
			query = `
			SELECT id, content, category, is_anonymous, upvotes, downvotes, real_votes, cap_votes, created_at
			FROM posts
			WHERE report_count < 10 AND category = $1 AND id < $2
			ORDER BY created_at DESC
			LIMIT $3`
			args = []any{category, cursor, limit}
		} else {
			query = `
			SELECT id, content, category, is_anonymous, upvotes, downvotes, real_votes, cap_votes, created_at
			FROM posts
			WHERE report_count < 10 AND category = $1
			ORDER BY created_at DESC
			LIMIT $2`
			args = []any{category, limit}
		}
	} else {
		if cursor > 0 {
			query = `
			SELECT id, content, category, is_anonymous, upvotes, downvotes, real_votes, cap_votes, created_at
			FROM posts
			WHERE report_count < 10 AND id < $1
			ORDER BY created_at DESC
			LIMIT $2`
			args = []any{cursor, limit}
		} else {
			query = `
			SELECT id, content, category, is_anonymous, upvotes, downvotes, real_votes, cap_votes, created_at
			FROM posts
			WHERE report_count < 10
			ORDER BY created_at DESC
			LIMIT $1`
			args = []any{limit}
		}
	}

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []model.Post
	for rows.Next() {
		var p model.Post
		if err := rows.Scan(
			&p.ID, &p.Content, &p.Category, &p.IsAnonymous,
			&p.Upvotes, &p.Downvotes, &p.RealVotes, &p.CapVotes, &p.CreatedAt,
		); err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}

	return posts, rows.Err()
}

// ListTrending returns paginated posts sorted by score (upvotes - downvotes).
func (r *PostRepo) ListTrending(ctx context.Context, limit int, offset int) ([]model.Post, error) {
	query := `
	SELECT id, content, category, is_anonymous, upvotes, downvotes, real_votes, cap_votes, created_at
	FROM posts
	WHERE report_count < 10
	ORDER BY (upvotes - downvotes) DESC, created_at DESC
	LIMIT $1 OFFSET $2`

	rows, err := r.db.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []model.Post
	for rows.Next() {
		var p model.Post
		if err := rows.Scan(
			&p.ID, &p.Content, &p.Category, &p.IsAnonymous,
			&p.Upvotes, &p.Downvotes, &p.RealVotes, &p.CapVotes, &p.CreatedAt,
		); err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}

	return posts, rows.Err()
}