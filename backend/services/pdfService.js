const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const ragService = require("./ragService");

module.exports = async(file) => {
    const loader = new PDFLoader(file.path);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    });

    const splitDocs = await splitter.splitDocuments(docs);
    const chunks = splitDocs.map(d => d.pageContent);

    await ragService(chunks, null);

    console.log("data stored in memory vectorstore");
}