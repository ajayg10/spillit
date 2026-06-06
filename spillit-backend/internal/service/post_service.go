package service

import (
	"context"
	"errors"
	"fmt"

	"spillit-backend/internal/model"
	"spillit-backend/internal/repository"
)

type PostService struct {
	repo *repository.PostRepo
}

func NewPostService(repo *repository.PostRepo) *PostService {
	return &PostService{repo: repo}
}

func (s *PostService) CreatePost(ctx context.Context, req model.CreatePostRequest) (*model.Post, error) {
	// Validate content
	if req.Content == "" {
		return nil, errors.New("content cannot be empty")
	}
	if len([]rune(req.Content)) > 2000 {
		return nil, errors.New("content cannot exceed 2000 characters")
	}

	// Validate category
	if req.Category == "" {
		return nil, errors.New("category is required")
	}
	if !model.ValidCategories[req.Category] {
		return nil, fmt.Errorf("invalid category %q: must be one of confession, college, relationships, career, random", req.Category)
	}

	return s.repo.Create(ctx, req)
}

func (s *PostService) GetPost(ctx context.Context, id int64) (*model.Post, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *PostService) ListFeed(ctx context.Context, category string, cursor int64, limit int) ([]model.Post, error) {
	if limit <= 0 || limit > 50 {
		limit = 20
	}
	// Validate category filter if provided
	if category != "" && !model.ValidCategories[category] {
		return nil, fmt.Errorf("invalid category filter %q", category)
	}
	return s.repo.ListLatest(ctx, category, cursor, limit)
}

func (s *PostService) ListTrending(ctx context.Context, limit int, offset int) ([]model.Post, error) {
	if limit <= 0 || limit > 50 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}
	return s.repo.ListTrending(ctx, limit, offset)
}