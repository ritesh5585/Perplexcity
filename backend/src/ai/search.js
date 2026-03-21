import { tavily } from "@tavily/core";
import dotenv from "dotenv";

dotenv.config();

const tavilyClient = process.env.TAVILY_API_KEY
    ? tavily({ apiKey: process.env.TAVILY_API_KEY })
    : null;

export async function searchWeb(query) {
    if (!tavilyClient) {
        console.warn("Web search unavailable — TAVILY_API_KEY not configured");
        return null;
    }

    try {
        const response = await tavilyClient.search(query, {
            maxResults: 3,
            searchDepth: "basic",
        });

        if (!response.results || response.results.length === 0) return null;

        const formatted = response.results
            .map(
                (r, i) =>
                    `[Source ${i + 1}]: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`
            )
            .join("\n\n");

        return formatted;
    } catch (error) {
        console.error("Tavily search error:", error.message);
        return null;
    }
}
