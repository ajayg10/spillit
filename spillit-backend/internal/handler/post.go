package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"spillit-backend/internal/model"
	"spillit-backend/internal/service"
	"spillit-backend/pkg/response"
)

type PostHandler struct {
	service *service.PostService
}

func NewPostHandler(s *service.PostService) *PostHandler {
	return &PostHandler{service: s}
}

// CreatePost handles POST /api/posts
func (h *PostHandler) CreatePost(w http.ResponseWriter, r *http.Request) {
	var req model.CreatePostRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "invalid JSON body")
		return
	}

	post, err := h.service.CreatePost(r.Context(), req)
	if err != nil {
		response.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	response.JSON(w, http.StatusCreated, post)
}

// GetPost handles GET /api/posts/{id}
func (h *PostHandler) GetPost(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		response.Error(w, http.StatusBadRequest, "invalid post ID")
		return
	}

	post, err := h.service.GetPost(r.Context(), id)
	if err != nil {
		response.Error(w, http.StatusNotFound, "post not found")
		return
	}

	response.JSON(w, http.StatusOK, post)
}

// ListPosts handles GET /api/posts?sort=latest|trending&category=...&cursor=...&limit=...
func (h *PostHandler) ListPosts(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	sort := q.Get("sort")
	category := q.Get("category")
	limitStr := q.Get("limit")
	cursorStr := q.Get("cursor")

	limit := 20
	if limitStr != "" {
		if v, err := strconv.Atoi(limitStr); err == nil {
			limit = v
		}
	}

	if sort == "trending" {
		offset := 0
		if cursorStr != "" {
			if v, err := strconv.Atoi(cursorStr); err == nil {
				offset = v
			}
		}
		posts, err := h.service.ListTrending(r.Context(), limit, offset)
		if err != nil {
			response.Error(w, http.StatusInternalServerError, "failed to fetch trending posts")
			return
		}
		response.JSON(w, http.StatusOK, posts)
		return
	}

	// Default: latest
	var cursor int64
	if cursorStr != "" {
		if v, err := strconv.ParseInt(cursorStr, 10, 64); err == nil {
			cursor = v
		}
	}

	posts, err := h.service.ListFeed(r.Context(), category, cursor, limit)
	if err != nil {
		response.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	response.JSON(w, http.StatusOK, posts)
}