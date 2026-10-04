const embeddings = require("../services/embeddingServices");

class SimpleMemoryVectorStore {
    constructor(embeddings) {
        this.embeddings = embeddings;
        this.store = [];
    }
    
    async addDocuments(docs) {
        const texts = docs.map(d => d.pageContent);
        const vectors = await this.embeddings.embedDocuments(texts);
        for (let i = 0; i < docs.length; i++) {
            this.store.push({ doc: docs[i], vector: vectors[i] });
        }
    }
    
    async similaritySearch(query, k = 5) {
        const queryVector = await this.embeddings.embedQuery(query);
        const dotProduct = (a, b) => a.reduce((sum, val, i) => sum + val * b[i], 0);
        
        const scored = this.store.map(item => ({
            ...item,
            score: dotProduct(item.vector, queryVector)
        }));
        
        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, k).map(item => item.doc);
    }
}

const vectorStore = new SimpleMemoryVectorStore(embeddings);
module.exports = vectorStore;
