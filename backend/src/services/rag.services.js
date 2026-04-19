import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

const index = pc.index("cohort-2-rag");

const embeddings = new MistralAIEmbeddings({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-embed",
});


export async function storeDocument(text, metadata = {}) {
    try {
        // STEP 1: Split text into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 50,
        });

        const chunks = await splitter.splitText(text);

        // STEP 2: Convert each chunk into embedding
        const docs = await Promise.all(
            chunks.map(async (chunk, i) => {
                const vector = await embeddings.embedQuery(chunk);

                return {
                    id: `doc-${Date.now()}-${i}`,
                    values: vector,
                    metadata: {
                        text: chunk,
                        ...metadata,
                    },
                };
            })
        );

        // STEP 3: Store in Pinecone
        await index.upsert(docs);

        return {
            success: true,
            message: "Document stored successfully",
            chunks: docs.length,
        };
    } catch (error) {
        console.error("StoreDocument Error:", error);
        throw error;
    }
}

export async function searchSimilarChunks(query) {
    try {
        // STEP 1: Convert query → embedding
        const queryEmbedding = await embeddings.embedQuery(query);

        // STEP 2: Search in Pinecone
        const result = await index.query({
            vector: queryEmbedding,
            topK: 5,
            includeMetadata: true,
        });

        // STEP 3: Extract text
        const chunks = result.matches.map(
            (match) => match.metadata.text
        );

        return chunks;
    } catch (error) {
        console.error("Search Error:", error);
        throw error;
    }
}

export async function getRAGContext(query) {
    const chunks = await searchSimilarChunks(query);

    return chunks.join("\n\n");
}