# Pair Programming Web Application

A real-time collaborative coding platform that enables two or more users to write code together in the same virtual room. Built with FastAPI (Python), WebSockets, React, TypeScript, and Redux Toolkit.

## Features

- **Real-Time Collaboration**: Multiple users can edit code simultaneously with instant synchronization
- **Room Management**: Create and join coding rooms with unique room IDs
- **WebSocket Communication**: Low-latency real-time updates using WebSocket connections
- **AI Autocomplete**: Mocked AI-powered code suggestions (rule-based, extensible to real AI)
- **Multiple Language Support**: Support for Python, JavaScript, TypeScript, Java, C++, and Go
- **Active User Tracking**: See how many users are currently in a room
- **Monaco Editor**: Professional code editor with syntax highlighting and IntelliSense

## Tech Stack

### Backend
- **Python 3.9+**
- **FastAPI**: Modern web framework for building APIs
- **WebSockets**: Real-time bidirectional communication
- **PostgreSQL**: Database for storing room state
- **SQLAlchemy**: SQL toolkit and ORM
- **Uvicorn**: ASGI server

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Redux Toolkit**: State management
- **Monaco Editor**: Code editor (same as VS Code)
- **Vite**: Build tool and dev server

## Quick Start

### Option 1: Using Docker

The easiest way to run the entire application:

```bash
# Navigate to project directory
cd pair-programming-app

# Start all services (database, backend, frontend)
docker-compose up --build

# Access the application
# - Frontend: http://localhost
# - Backend API: http://localhost:8000
# - API Docs: http://localhost:8000/docs
```

To stop:
```bash
docker-compose down
```

### Option 2: Manual Setup (Run locally)

#### Prerequisites

- Python 3.9 or higher
- Node.js 18 or higher (for frontend)
- PostgreSQL 13 or higher
- npm or yarn

#### Step 1: Setup PostgreSQL Database

```bash
# Create database
createdb pairprogramming

# Or using psql
psql -U postgres
CREATE DATABASE pairprogramming;
\q
```

#### Step 2: Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
python -m app.database.init_db

# Run backend
python run.py
```

Backend will run on:
- API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- Health Check: http://localhost:8000/health

Example `.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/pairprogramming
APP_HOST=0.0.0.0
APP_PORT=8000
DEBUG=True
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

#### Step 3: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Run frontend
npm run dev
```

Frontend will run on:
- UI: http://localhost:5173

Example `.env`:
```
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## Architecture Overview

### Backend Architecture

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration settings
│   ├── database/
│   │   ├── connection.py       # Database connection setup
│   │   └── init_db.py          # Database initialization
│   ├── models/
│   │   └── room.py             # SQLAlchemy models
│   ├── schemas/
│   │   └── room.py             # Pydantic schemas for validation
│   ├── services/
│   │   ├── room_service.py     # Room business logic
│   │   ├── autocomplete_service.py  # Autocomplete logic
│   │   └── websocket_manager.py     # WebSocket connection management
│   └── routers/
│       ├── rooms.py            # REST endpoints for rooms
│       ├── autocomplete.py     # Autocomplete endpoint
│       └── websocket.py        # WebSocket endpoint
├── requirements.txt
├── run.py
└── .env.example
```

### Frontend Architecture

```
frontend/
├── src/
│   ├── components/
│   │   └── CodeEditor.tsx      # Monaco editor with autocomplete
│   ├── pages/
│   │   ├── Home.tsx            # Landing page for creating/joining rooms
│   │   └── Room.tsx            # Collaborative coding room
│   ├── store/
│   │   ├── index.ts            # Redux store configuration
│   │   └── editorSlice.ts      # Editor state slice
│   ├── services/
│   │   ├── api.ts              # HTTP API client
│   │   └── websocket.ts        # WebSocket client
│   ├── hooks/
│   │   ├── useRedux.ts         # Typed Redux hooks
│   │   └── useWebSocket.ts     # WebSocket hook
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Entry point
├── package.json
├── vite.config.ts
└── .env.example
```

## API Endpoints

### REST Endpoints

#### POST /rooms
Create a new coding room.

**Request:**
```json
{
  "language": "python"
}
```

**Response:**
```json
{
  "room_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### GET /rooms/{room_id}
Get room details.

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "# Start coding...",
  "language": "python",
  "created_at": "2025-01-26T12:00:00Z",
  "active_users": 2
}
```

#### POST /autocomplete
Get autocomplete suggestion (mocked).

**Request:**
```json
{
  "code": "def calculate",
  "cursor_position": 13,
  "language": "python"
}
```

**Response:**
```json
{
  "suggestion": ":\n    pass",
  "start_position": 13,
  "end_position": 19
}
```

### WebSocket Endpoint

#### WS /ws/{room_id}
Connect to a room for real-time collaboration.

**Client → Server Messages:**
```json
{
  "type": "code_update",
  "code": "print('hello')",
  "user_id": "user123"
}
```

**Server → Client Messages:**
```json
{
  "type": "init",
  "code": "# Start coding...",
  "language": "python",
  "active_users": 2
}
```

## Testing Without Frontend

### Using Postman:

1. **Create a room:**
   ```
   POST http://localhost:8000/rooms
   Body: {"language": "python"}
   ```

2. **Test autocomplete:**
   - Method: POST
   - URL: `http://localhost:8000/autocomplete`
   - Body: `{"code": "def test", "cursor_position": 8, "language": "python"}`

3. **Test WebSocket:**
   - Use Postman WebSocket feature
   - URL: `ws://localhost:8000/ws/{room_id}`
   - Send: `{"type": "code_update", "code": "print('test')"}`

### Using cURL:

```bash
# Create room
curl -X POST http://localhost:8000/rooms \
  -H "Content-Type: application/json" \
  -d '{"language": "python"}'

# Get room details
curl http://localhost:8000/rooms/{room_id}

# Test autocomplete
curl -X POST http://localhost:8000/autocomplete \
  -H "Content-Type: application/json" \
  -d '{"code": "def test", "cursor_position": 8, "language": "python"}'
```

### Using Browser:

Visit http://localhost:8000/docs for interactive API documentation (Swagger UI).

## Common Issues

### Port Already in Use

If port 8000 or 5173 is already in use:

**Backend:**
```bash
# Change port in .env
APP_PORT=8001
```

**Frontend:**
```bash
# Change port in vite.config.ts
server: { port: 3000 }
```

### Database Connection Error

Make sure PostgreSQL is running:
```bash
# Check status
pg_ctl status

# Start PostgreSQL (macOS with Homebrew)
brew services start postgresql

# Start PostgreSQL (Linux)
sudo systemctl start postgresql
```

### Frontend Can't Connect to Backend

Check CORS settings in backend/.env:
```
ALLOWED_ORIGINS=["http://localhost:5173","http://localhost:3000"]
```

## Design Choices

### 1. **WebSocket-Based Real-Time Sync**
   - **Choice**: Used WebSocket for bidirectional real-time communication
   - **Rationale**: Lower latency than HTTP polling, maintains persistent connection
   - **Implementation**: Connection manager handles multiple rooms and broadcasts updates

### 2. **Last-Write Wins Strategy**
   - **Choice**: Simple conflict resolution where the latest update overwrites previous state
   - **Rationale**: Easy to implement, sufficient for 2-user scenario
   - **Trade-off**: More complex CRDT (Conflict-free Replicated Data Types) would be better for many users

### 3. **PostgreSQL for Persistence**
   - **Choice**: Store room state in PostgreSQL instead of pure in-memory
   - **Rationale**: Allows room recovery after server restart, scalable
   - **Implementation**: SQLAlchemy ORM for clean database abstraction

### 4. **Mocked Autocomplete**
   - **Choice**: Rule-based pattern matching instead of real AI
   - **Rationale**: Demonstrates the API contract, easy to swap with real AI later
   - **Implementation**: Simple regex patterns for common code structures

### 5. **Monaco Editor**
   - **Choice**: Same editor as VS Code
   - **Rationale**: Professional features out of the box, familiar UX
   - **Trade-off**: Larger bundle size than simpler editors

### 6. **Redux Toolkit**
   - **Choice**: Minimal Redux implementation for state management
   - **Rationale**: Predictable state updates, easy debugging
   - **Implementation**: Single slice for editor state

## Limitations

### Current Limitations:

1. **Conflict Resolution**: Last-write wins is simplistic
   - Multiple simultaneous edits may cause overwrites
   - No operational transforms or CRDT implementation

2. **No Cursor Tracking**: Remote cursors not visually displayed
   - WebSocket messages support cursor positions
   - Frontend implementation needs additional work

3. **No User Authentication**: Anyone can create/join rooms
   - No access control or room passwords
   - Room IDs are the only security mechanism

4. **In-Memory WebSocket State**: Connection manager is in-memory
   - Server restart disconnects all users
   - Not horizontally scalable without Redis pub/sub

5. **Basic Autocomplete**: Rule-based, not intelligent
   - No context awareness
   - No machine learning model integration

6. **No Code History**: No undo/redo across clients
   - Local editor undo only
   - No version control or snapshots

7. **Single Server**: No load balancing or clustering
   - WebSocket sticky sessions needed for scale
   - Would need Redis for multi-server deployment

## Improvements with More Time

### High Priority:

1. **Operational Transform (OT) or CRDT**
   - Implement proper conflict-free editing algorithm
   - Support for simultaneous edits without overwrites
   - Libraries: ShareDB, Yjs, Automerge

2. **User Authentication & Authorization**
   - JWT-based/ OAuth authentication
   - Room ownership and permissions
   - Private rooms with access codes

3. **Remote Cursor Display**
   - Show other users' cursors and selections
   - Different colors per user
   - User presence indicators

4. **Real AI Autocomplete**
   - Integrate OpenAI Codex, GitHub Copilot, or Tabnine
   - Context-aware suggestions
   - Multi-line completions

5. **Redis for Scalability**
   - Redis pub/sub for WebSocket broadcasting
   - Shared session storage
   - Horizontal scaling support

### Medium Priority:

6. **Code Execution**
   - Run code in sandboxed environment
   - Display output in UI

7. **Chat Feature**
   - Real-time text chat alongside code
   - Code snippet sharing in chat
   - Voice/video integration

8. **Version History**
   - Save code snapshots periodically
   - Browse and restore previous versions
   - Git-like diff view

9. **Syntax Error Detection**
   - Real-time linting and error highlighting
   - Language-specific validators
   - Fix suggestions

10. **Room Settings**
    - Configure language, theme, font size
    - Enable/disable features
    - Room expiration time

### Low Priority:

11. **Mobile Support**
    - Responsive design
    - Touch-optimized editor
    - Progressive Web App (PWA)

12. **Analytics & Monitoring**
    - Track active rooms and users
    - Error logging and alerting
    - Performance metrics

13. **File Upload/Download**
    - Upload existing code files
    - Download code as files
    - Import from GitHub

## Project Structure

```
pair-programming-app/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── routers/      # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── models/       # Database models
│   │   └── schemas/      # Pydantic schemas
│   └── requirements.txt
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store
│   │   └── services/     # API clients
│   └── package.json
├── docker-compose.yml    # Docker setup
└── README.md            # Full documentation
```

## Docker Deployment

See `docker-compose.yml` for containerized deployment with PostgreSQL included.

```bash
docker-compose up --build
```

The application will be available at:
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`

---

**Built with:** FastAPI, WebSockets, React, TypeScript, Redux Toolkit, Monaco Editor, PostgreSQL
