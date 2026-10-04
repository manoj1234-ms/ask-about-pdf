const { OpenAIEmbeddings } = require("@langchain/openai");

const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1"
    }
});

module.exports = embeddings;

//text

//openai e,beedings

//vector number