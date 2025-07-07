# URLInsight — Front-end Requirements

1. **Tech Stack & Tooling**
   - React Web application (Create React App or Vite)
   - TypeScript
   - Tailwind CSS (or your preferred styling solution)
   - ESLint + Prettier

2. **URL Management**
   - Form to add a new URL for analysis
   - Start/Stop buttons per URL row

3. **Results Dashboard**
   - Paginated, sortable table with columns:
     - Title
     - HTML Version
     - # Internal Links
     - # External Links
     - # Broken Links
     - Login Form (Y/N)
     - Status (queued, running, done, error)
   - Column filters (e.g. by status, login form presence)
   - Global search box (fuzzy or prefix matching)

4. **Details View**
   - Route: `/urls/:id`
   - Donut or bar chart of internal vs. external links (e.g., using Recharts)
   - List/table of broken links with their HTTP status codes
   - Back button to return to the dashboard

5. **Bulk Actions**
   - Checkboxes to select multiple URLs
   - Buttons to “Re-run Analysis” and “Delete Selected”

6. **Real-Time Progress**
   - Show each URL’s current status (queued → running → done/error)
   - Polling or Server-Sent Events/WebSockets for live updates

7. **Mobile-First, Responsive Design**
   - Single-column stacking on small screens
   - Table scroll container for mobile
   - Breakpoint-based layouts (e.g., `sm:`, `md:`)

8. **Testing**
   - Jest + React Testing Library
   - Happy-path scenarios:
     - Adding a URL
     - Viewing & searching the list
     - Sorting & pagination
     - Navigating to the detail view

9. **Documentation & Setup**
   - `README.md` with clear install/build/run instructions
   - `.env.example` for API base URL
