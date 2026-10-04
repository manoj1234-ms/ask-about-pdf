# Ask About PDF

Ask About PDF is a PDF question-answering app built with a Next.js frontend and an Express backend. Upload a PDF, create embeddings for its text, and ask questions answered using relevant document content.

## Features

- Upload one PDF at a time through the web interface.
- Extract PDF text and split it into overlapping chunks.
- Generate embeddings through OpenRouter's OpenAI-compatible API.
- Retrieve relevant chunks and use them as context for chat answers.

## Quick start

Requirements: Node.js 20.9 or later, npm, and an OpenRouter API key.

1. Create `backend/.env`:

   ```dotenv
   PORT=5000
   OPENAI_API_KEY=your_openrouter_api_key
   ```

   `POSTGRES_URI` is optional for the current PDF question-answering flow.

2. In one terminal, install and start the backend:

   ```powershell
   cd backend
   npm install
   npm start
   ```

3. In another terminal, install and start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000), upload a PDF, and ask a question.

## Documentation

- [Frontend guide](frontend/README.md): UI behavior, frontend setup, and development checks.
- [Backend guide](backend/README.md): environment configuration, API endpoints, and processing flow.

## Important limitations

- Embeddings and document chunks are stored in memory and are cleared when the backend restarts.
- There is no user or document isolation between uploads.
- ChromaDB is configured as a dependency but is not used by the current retrieval flow.
- PostgreSQL is optional and PDF metadata is not currently saved to it.

Do not commit API keys, `.env` files, uploaded documents, or dependency/build directories. The root `.gitignore` excludes these local files.
