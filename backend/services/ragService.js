const vectorStore = require("../config/vectorstore");

module.exports = async(chunks, vectors) => {
    const docs = chunks.map(chunk => ({
        pageContent: chunk,
        metadata: {}
    }));
    await vectorStore.addDocuments(docs);
};