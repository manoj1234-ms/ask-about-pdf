const embeddings = require("../services/embeddingServices");
const client = require("../config/chromadb");
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
});

exports.askQuestion = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                error: "Question is required",
            });
        }

        // Convert question into embedding
        const queryEmbedding = await embeddings.embedQuery(question);

        const vectorStore = require("../config/vectorstore");

        // Semantic search
        const results = await vectorStore.similaritySearch(question, 5);

        // Create context
        const context = results.map(r => r.pageContent).join("\n");

        // Ask OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "Answer the user's question using only the provided context. If the answer is not present in the context, say that you don't know.",
                },
                {
                    role: "user",
                    content: `Context:
${context}

Question:
${question}`,
                },
            ],
        });

        res.json({
            answer: completion.choices[0].message.content,
        });
    } catch (error) {
        console.error("Chat error:", error);

        res.status(500).json({
            error: "Something went wrong",
            message: error.message,
        });
    }
};