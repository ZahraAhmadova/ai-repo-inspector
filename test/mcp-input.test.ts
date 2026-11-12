import { describe, expect, it } from "vitest";
import { toReviewRequest } from "../src/mcp-input.js";

describe("MCP review input", () => {
  it("maps repo_path to repositoryPath", () => {
    const result = toReviewRequest({
      repo_path: "/example/project",
      baseRef: "main",
      validationCommands: ["npm test"],
    });

    expect(result).toEqual({
      repositoryPath: "/example/project",
      baseRef: "main",
      validationCommands: ["npm test"],
    });
  });
});