# ---- Build stage ----
FROM golang:1.22-alpine AS builder
WORKDIR /app

# Cache deps
COPY go.mod go.sum ./
RUN go mod download

# Build binary
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /spillit-api ./cmd/server

# ---- Run stage ----
FROM alpine:3.20
RUN apk add --no-cache ca-certificates wget
COPY --from=builder /spillit-api /spillit-api
EXPOSE 8080
CMD ["/spillit-api"]