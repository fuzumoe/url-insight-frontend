# URLInsight — Back-end Requirements

1. **Tech Stack & Tooling**
   - Go (Golang)
   - Gin framework
   - GORM ORM + MySQL
   - Go modules (`go.mod` + `go.sum`)
   - Dockerfile (optional, for containerization)

2. **Data Model**
   - `urls` table:
     - `id`, `original_url`, `status` (queued, running, done, error), timestamps
   - `analysis_results` table:
     - `url_id` (FK), `html_version`, `title`, heading counts, `has_login_form`, timestamps
   - `links` table:
     - `url_id` (FK), `href`, `is_external`, `status_code`

3. **Crawling & Analysis Logic**
   - Fetch the page HTML
   - Detect HTML version (`<!DOCTYPE html>` vs. HTML4, etc.)
   - Extract `<title>` text
   - Count heading tags (`<h1>`–`<h6>`)
   - Classify and record internal vs. external links
   - Identify broken links (HTTP 4xx/5xx)
   - Detect login forms (`<form>` with `<input type="password">`)

4. **API Endpoints**
   - **Auth Middleware** (Bearer token or JWT)
   - `POST /api/urls` – enqueue a new URL
   - `PATCH /api/urls/:id/start` – start processing
   - `PATCH /api/urls/:id/stop` – stop processing
   - `GET /api/urls` – list URLs with pagination, sorting, filtering
   - `GET /api/urls/:id` – fetch a single URL’s metadata
   - `GET /api/urls/:id/results` – full analysis result (incl. link list)
   - `DELETE /api/urls/:id` – remove a URL and its data

5. **Real-Time Status Updates**
   - Update the URL’s `status` field as it moves through the crawl pipeline
   - Expose via polling or push (SSE/WebSocket)

6. **Error Handling & Reporting**
   - Centralized JSON error responses
   - Graceful panic recovery (Gin’s Recovery middleware)

7. **Reproducible Builds & Migrations**
   - `go.mod` & `go.sum` checked into Git
   - Auto-migrations via GORM or file-based migrations (e.g., `golang-migrate`)
   - Connection pool tuning

8. **Testing**
   - Unit tests for parsing/analysis logic (HTML version detection, link classification)
   - (Optional) Integration tests for API endpoints

9. **Documentation & Setup**
   - `README.md` with:
     1. Clone instructions
     2. Environment variables (`.env.example`)
     3. How to run migrations
     4. How to build & start the server
