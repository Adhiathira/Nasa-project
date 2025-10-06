
# **Product Requirements Document (PRD)**

### Product: 3D Research Graph MVP

### Type: Frontend MVP (Demo)

## **MVP Philosophy**

**This is a rapid prototype focused on speed and iteration, not production-ready code.**

### Development Priorities
1. **Speed over perfection**: Build features quickly, iterate based on user feedback
2. **Manual testing over automation**: Visual verification and user testing, not comprehensive test suites
3. **Docker deployment**: Primary deployment method using `docker-compose`
4. **Desktop-only**: No mobile responsiveness required for MVP

### Testing Approach
- **NO automated tests required**: Focus on building, not testing infrastructure
- **Visual verification**: Use Playwright MCP sparingly for quick UI checks
- **Manual testing**: User validates each feature after implementation
- **Browser console checks**: Ensure no errors, but no formal test frameworks

### Deployment Method
- **Primary**: Docker via `frontend/docker-compose.yml`
- **Alternative**: `npm run dev` for development only
- **Port**: 5173 (configurable)

## **1. Objective**

Build a **frontend MVP** that demonstrates an **interactive 3D molecular-style visualization** of research papers and their relationships.

The MVP will:

* Allow users to **search** research topics.
* Render results as **3D nodes** in an interactive space.
* Let users **click nodes** to view summaries and interact.
* Support **Expand** and **Chat** actions using existing backend REST APIs.

This is a demo build — backend APIs already exist. No backend or database work is in scope.

---

## **2. Scope**

### **In Scope**

* Single-page React-based web interface.
* Integration with backend endpoints:

  * `/api/search` → returns initial list of papers.
  * `/api/search_paper` → returns related papers.
  * We will setup a python service for backend which will mock the rest api endpoints.
* Visualization of data as 3D graph with nodes (papers) and edges (relationships).
* Node interactions:

  * Click to view paper details.
  * “Expand” to fetch related papers.
  * “Chat” to open a per-node conversation window.
* Smooth camera movement, zoom, and rotation.
* Unique color per expansion session.
* Edge width based on similarity.

### **Out of Scope**

* User authentication or persistence.
* Complex filtering, clustering, or analytics.
* Mobile responsiveness (desktop only).
* Custom backend logic or new APIs.

---

## **3. User Flow**

### **Step 1: Search**

* User sees a dark background with a centered **search bar**.
* On submitting a query → frontend calls `/api/search`.
* The search bar fades out and 3D graph appears.

### **Step 2: View Graph**

* Each returned paper appears as a **3D node** (sphere).
* User can **rotate**, **zoom**, and **pan** in the 3D environment.
* Hovering over a node shows its **title**.
* Clicking a node:

  * Focuses the camera on it.
  * Opens a **detail panel** on the right.

### **Step 3: View Node Details**

* Panel displays:

  * Paper title
  * Paper summary
  * Two buttons:

    1. **Expand** — calls `/api/search_paper` and adds related nodes + edges.
    2. **Chat** — opens a small chat window anchored to that node.

### **Step 4: Expand**

* Expand call (`/api/search_paper`) returns related papers.
* Each new paper becomes a node connected by an edge.
* Each expand action generates:

  * Unique edge color (to indicate expansion source).
  * Edge width mapped to similarity score.

### **Step 5: Chat**

* Clicking **Chat** opens a chat window for that paper.
* Messages appear as alternating bubbles (user ↔ AI).
* Chat uses existing REST API endpoint.

---

## **4. Functional Requirements**

| ID | Feature        | Description                                                | API / Action             |
| -- | -------------- | ---------------------------------------------------------- | ------------------------ |
| F1 | Search Bar     | Input for query; triggers `/api/search` call.              | POST `/api/search`       |
| F2 | Render Nodes   | Show each paper as a 3D node.                              | Render only              |
| F3 | Graph Controls | Rotate, zoom, drag graph freely.                           | Client-side              |
| F4 | Node Click     | Focus camera + show details panel.                         | UI event                 |
| F5 | Expand         | Fetch related papers + show connected nodes/edges.         | POST `/api/search_paper` |
| F6 | Edge Color     | Assign unique color for each expand call.                  | Frontend                 |
| F7 | Edge Weight    | Map similarity value to edge thickness.                    | Frontend                 |
| F8 | Chat           | Open per-node chat window; integrate with backend.         | REST API                 |
| F9 | Reset          | Allow user to reset view (clear graph + return to search). | UI only                  |

---

## **5. Data Contracts**

### **/api/search**

**Input:**

```json
{ "query": "photosynthesis" }
```

**Output:**

```json
[
  {
    "paper_id": "uuid",
    "metadata": { "title": "Paper Title", "summary": "Short summary" },
    "similarity": 0.87
  }
]
```

### **/api/search_paper**

**Input:**

```json
{ "paper_id": "uuid", "conversation": "optional string" }
```

**Output:**

```json
[
  {
    "paper_id": "uuid",
    "metadata": { "title": "Related Paper", "summary": "Short summary" },
    "similarity": 0.73
  }
]
```

---

## **6. Technical Requirements**

| Area             | Tool / Approach                               |
| ---------------- | --------------------------------------------- |
| Framework        | React + TypeScript                            |
| 3D Engine        | `3d-force-graph` (Three.js-based)             |
| State Management | Zustand                                       |
| API Calls        | TanStack Query (React Query)                  |
| Styling          | TailwindCSS                                   |
| Build Tool       | Vite                                          |
| Environment      | Desktop browser (Chrome, Edge, Safari latest) |

---

## **7. UI/UX Requirements**

| Element          | Behavior / Style                                      |
| ---------------- | ----------------------------------------------------- |
| **Background**   | Black (#000000) with faint blue cosmic glow           |
| **Nodes**        | Spheres (radius ~2.6), subtle outer glow              |
| **Edges**        | Colored per expand session; width = similarity weight |
| **Camera**       | Smooth zoom/pan/rotate transitions                    |
| **Text**         | Inter or Alerta font; white text                      |
| **Detail Panel** | Right-aligned frosted-glass card                      |
| **Buttons**      | “Expand” (primary, white bg), “Chat” (outline)        |
| **Chat UI**      | Simple two-column message layout, scrolling container |
| **Reset**        | Floating button (bottom left) to restart search       |


## **9. Deliverables**

* Complete React frontend integrated with backend APIs.
* Working demo with:

  * Search → 3D Graph → Node click → Expand → Chat.
* Configurable backend endpoints via `.env`.
* Basic documentation (README) for setup & run.

