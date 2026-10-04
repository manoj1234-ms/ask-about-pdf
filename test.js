require("dotenv").config({ path: "./backend/.env" });
const embeddings = require("./backend/services/embeddingServices");
const client = require("./backend/config/chromadb");

async function test() {
    try {
        console.log("Testing embeddings...");
        const res = await embeddings.embedDocuments(["hello world"]);
        console.log("Embeddings OK!");
        
        console.log("Testing ChromaDB...");
        const collection = await client.getOrCreateCollection({ name: "Documents" });
        console.log("ChromaDB OK!");
    } catch(e) {
        console.error("Test failed:", e);
    }
}
test();
