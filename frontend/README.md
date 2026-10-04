# OmniRAG Engine

OmniRAG Engine is a document question-answering app. Upload a PDF, let the backend extract and embed its text, and ask questions about the uploaded content through a chat interface.

This folder contains the Next.js frontend. The Express API and document-processing services are in the sibling `backend` folder.

## How it works

1. Select a PDF and choose **Embed Document**.
2. The frontend sends the file to the backend.
3. The backend extracts the PDF text, splits it into overlapping chunks, and creates embeddings through OpenRouter's OpenAI-compatible API.
4. The backend keeps those chunks and embeddings in an in-memory vector store.
5. Ask a question. The backend finds relevant chunks and sends them as context to the chat model, which responds using that context.

The chat page displays the conversation and upload status. It does not persist chat history across page reloads.

## Requirements

- Node.js 20.9 or later
- npm
- An OpenRouter API key for PDF embedding and question answering

## Run locally

Open two terminals from the project root.

### 1. Configure and start the backend

Create `backend/.env` with your OpenRouter API key:

```dotenv
PORT=5000
OPENAI_API_KEY=your_openrouter_api_key
```

`POSTGRES_URI` is optional. The current document retrieval flow uses in-memory storage; PostgreSQL is not required for uploading PDFs or asking questions.

Then start the API:

```powershell
cd backend
npm install
npm start
```

The API listens on `http://localhost:5000`.

### 2. Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The frontend currently calls the API at `http://localhost:5000` directly. If you run the backend on another host or port, update those API URLs in `src/app/page.tsx`.

## Using the app

1. Start both the backend and frontend.
2. Choose a PDF file in the **Knowledge Base Setup** section.
3. Select **Embed Document** and wait for the success message.
4. Enter a question about the document and select **Send**.

The backend returns an error if the question is missing or a processing/API request fails. The UI displays upload and chat errors when a request cannot be completed.

## API overview

The frontend uses these backend endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Backend health message |
| `POST` | `/api/upload` | Upload and process one PDF as multipart form data with field name `file` |
| `POST` | `/api/ask` | Ask a question using JSON such as `{"question":"What is this document about?"}` |

## Project structure

```text
frontend/
  src/app/
    page.tsx       # Upload and chat interface
    layout.tsx     # App metadata and root layout
    globals.css    # Global styles
backend/
  server.js        # Express server and API route registration
  routes/          # Upload and chat endpoints
  controllers/     # HTTP request handlers
  services/        # PDF extraction, chunking, embeddings, and retrieval
  config/          # Database and vector-store setup
```

## Development checks

From this folder:

```powershell
npm run lint
npm run build
```

The backend currently does not define an automated test suite.

## Current limitations

- The vector store is in memory. Uploaded document chunks are lost when the backend process restarts.
- Uploaded documents are held in one shared index; there is no user, session, or document-level isolation.
- The backend has ChromaDB configuration code, but the active retrieval implementation uses the in-memory store.
- PostgreSQL is optional and currently only used to attempt a `pdfs` table setup; PDF metadata is not saved by the upload flow.
- The chat history exists only in the browser page state.
- The backend accepts one uploaded file per request.

For backend configuration, API behavior, and implementation details, see [`../backend/README.md`](../backend/README.md).
