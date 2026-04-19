import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { tavily } from "@tavily/core";
import dotenv from "dotenv";

dotenv.config();

const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });

const tavilySearch = tool(
  async ({ query }) => {
    try {
      const response = await tavilyClient.search(query, {
        maxResults: 3,
        searchDepth: "basic",
      });

      if (!response.results?.length) return "No results found.";

      return response.results
        .map(
          (r, i) =>
            `[Source ${i + 1}]: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`
        )
        .join("\n\n");
    } catch (error) {
      return `Search failed: ${error.message}`;
    }
  },
  {
    name: "tavily_search",
    description: "Search the web for current information using Tavily.",
    schema: z.object({
      query: z.string().describe("The search query"),
    }),
  }
);

const ragTool = tool(
  async ({ query }) => {
    return await getRAGContext(query)
  },
  {
    name: "search_documents",
    description: "Search uploaded documents for information",
    schema: z.object({ query: z.string() })
  }
)

export const tools = [tavilySearch, ragTool]