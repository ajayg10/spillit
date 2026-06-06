package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"

	"spillit-backend/internal/config"
	"spillit-backend/internal/db"
	"spillit-backend/internal/handler"
	"spillit-backend/internal/repository"
	"spillit-backend/internal/service"
	"spillit-backend/pkg/response"
)

func main() {
	// 🔹 Load config
	cfg := config.Load()

	// 🔹 Setup DB connection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	pool, err := db.New(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer pool.Close()

	// 🔹 Initialize Router
	r := chi.NewRouter()

	// 🔹 Global Middleware
	r.Use(chiMiddleware.Logger)
	r.Use(chiMiddleware.Recoverer)
	r.Use(chiMiddleware.RealIP)
	r.Use(chiMiddleware.RequestID)

	// 🔹 Health Check
	r.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	// =========================
	// 🔥 DEPENDENCY INJECTION
	// =========================

	// Repository
	postRepo := repository.NewPostRepo(pool)

	// Service
	postService := service.NewPostService(postRepo)

	// Handler
	postHandler := handler.NewPostHandler(postService)

	// =========================
	// 🚀 ROUTES
	// =========================

	r.Route("/api", func(api chi.Router) {
		api.Get("/posts", postHandler.ListPosts)
		api.Get("/posts/{id}", postHandler.GetPost)
		api.Post("/posts", postHandler.CreatePost)
	})

	// =========================
	// 🌐 SERVER CONFIG
	// =========================

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// 🔹 Start server in goroutine
	go func() {
		log.Printf("🚀 Server running on port %s", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// 🔹 Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("🛑 Shutting down server...")

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer shutdownCancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("Forced shutdown: %v", err)
	}

	log.Println("✅ Server exited cleanly")
}