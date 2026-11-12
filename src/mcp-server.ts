#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { reviewRepository } from "./core.js";
import { toReviewRequest } from "./mcp-input.js";

const server = new McpServer({ name: "repository-inspector", version: "2.0.0" });

server.tool(
  "review_repository",
  "Inspects a Git repository and returns a review report.",
  {
    repo_path: z.string().describe("Repository path to inspect."),
    baseRef: z.string().optional(),
    validationCommands: z.array(z.string()).optional(),
  },
async (input) => {
  const report = await reviewRepository(toReviewRequest(input));
  return { content: [{ type: "text" as const, text: report }] };
},
);

await server.connect(new StdioServerTransport());