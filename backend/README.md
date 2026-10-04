# OmniRAG Engine Backend

This folder contains the Express API for the OmniRAG Engine PDF question-answering app. It accepts PDF uploads, extracts and chunks document text, creates embeddings, retrieves relevant chunks, and sends them to a chat model for an answer.

## Requirements

- Node.js 20.9 or later
- npm
- An OpenRouter API key
- PostgreSQL only if you want the optional database connection/table setup

## Setup

Create a `.env` file in this folder:

```dotenv
PORT=5000
OPENAI_API_KEY=your_openrouter_api_key
POSTGRES_URI=<your PostgreSQL connection string>
```

`POSTGRES_URI` is optional. If it is missing or the database cannot be reached, the server logs a warning and continues. The current PDF retrieval flow does not depend on PostgreSQL.

Install dependencies and start the API:

```powershell
npm install
npm start
```

The server uses port `5000` by default. Set `PORT` in `.env` to use another port.

## API

### Health check

```http
GET /
```

Returns a short message indicating that the server is running.

### Upload a PDF

```http
POST /api/upload
Content-Type: multipart/form-data
```

Include one file under the multipart field name `file`. The endpoint returns:

```json
{ "success": true }
```

The backend loads the PDF, splits its text into chunks of up to 1,000 characters with 200 characters of overlap, embeds each chunk, and adds it to the in-memory vector store.

### Ask a question

```http
POST /api/ask
Content-Type: application/json
```

Request:

```json
{ "question": "What is this document about?" }
```

Successful response:

```json
{ "answer": "..." }
```

An empty or missing question returns HTTP `400`. Processing and provider errors return HTTP `500` with an error message.

## Request flow

- `server.js` loads environment variables, configures Express and CORS, attempts the optional PostgreSQL connection, and mounts the API routes.
- `routes/uploadroutes.js` accepts the uploaded file using Multer.
- `controllers/uploadController.js` validates that a file was supplied and calls the PDF service.
- `services/pdfService.js` extracts PDF text with LangChain's `PDFLoader` and splits the text into overlapping chunks.
- `services/ragService.js` converts the chunks to documents and passes them to the vector store.
- `config/vectorstore.js` embeds and stores documents in a process-local in-memory vector store, then ranks results by dot product.
- `controllers/chatController.js` searches for the five most relevant chunks and calls the `gpt-4o-mini` chat model via OpenRouter with those chunks as context.
- `services/embeddingServices.js` configures LangChain's OpenAI-compatible embeddings client to use OpenRouter.

## Project structure

```text
backend/
  config/
    chromadb.js       # ChromaDB client setup (not used by active retrieval)
    postgres.js       # Optional PostgreSQL connection and table setup
    vectorstore.js    # Active in-memory vector store
  controllers/
    chatController.js
    uploadController.js
  models/
  routes/
    chatroutes.js
    uploadroutes.js
  services/
    embeddingServices.js
    pdfService.js
    ragService.js
  server.js
```

## Current limitations

- Document chunks and embeddings exist only in memory. Restarting the server clears them.
- Documents are placed in a shared vector store with no user or document isolation.
- ChromaDB is installed and has a client configuration, but it is not wired into the current retrieval flow.
- PostgreSQL is optional and the upload flow does not currently persist PDF metadata, despite initializing a `pdfs` table.
- Uploaded files are written under the `uploads/` directory and are not automatically removed after processing.
- `npm test` is a placeholder and exits with an error because no backend test suite is configured yet.

The frontend setup and user workflow are documented in [`../frontend/README.md`](../frontend/README.md).
