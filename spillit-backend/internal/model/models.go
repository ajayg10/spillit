package model

import "time"

// Post represents a story in Spillit
type Post struct {
	ID           int64     `json:"id"`
	PseudonymID  *int64    `json:"pseudonym_id,omitempty"` // nullable FK
	Content      string    `json:"content"`
	Category     string    `json:"category"`
	IsAnonymous  bool      `json:"is_anonymous"`
	Upvotes      int       `json:"upvotes"`
	Downvotes    int       `json:"downvotes"`
	RealVotes    int       `json:"real_votes"`
	CapVotes     int       `json:"cap_votes"`
	ReportCount  int       `json:"-"` // hidden from API response
	CreatedAt    time.Time `json:"created_at"`
}

// CreatePostRequest is the DTO for creating a post
type CreatePostRequest struct {
	Content     string `json:"content"`
	Category    string `json:"category"`
	IsAnonymous *bool  `json:"is_anonymous"` // pointer so we can detect missing vs false
}

// Valid categories for posts
var ValidCategories = map[string]bool{
	"confession":    true,
	"college":       true,
	"relationships": true,
	"career":        true,
	"random":        true,
}