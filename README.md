# URLInsight Frontend

A React + TypeScript web application for managing URL analyses, viewing crawl results, and exploring detailed metrics.

## Features

- **URL Management**  
  Add new URLs, start/stop crawls, bulk actions (re-run, delete)
- **Dashboard**  
  Paginated, sortable, filterable table of URL summaries
- **Detail View**  
  Donut/bar chart of internal vs. external links, broken-links list
- **Real-Time Status**  
  Polling-based status updates (queued → running → done / error)
- **Responsive Design**  
  Mobile-first layout with Tailwind CSS
- **Tests**  
  Jest + React Testing Library covering core user flows

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16+  
- [npm](https://npmjs.com/) or [Yarn](https://yarnpkg.com/)  
- A running instance of the **URLInsight Backend** API (see `REACT_APP_API_URL` below)

---

## Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-org/urlinsight-frontend.git
   cd urlinsight-frontend
