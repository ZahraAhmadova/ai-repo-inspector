import type { ReviewRequest } from "./types.js";

export type McpReviewInput = {
  repo_path: string;
  baseRef?: string;
  validationCommands?: string[];
};

export function toReviewRequest(input: McpReviewInput): ReviewRequest {
  return {
    repositoryPath: input.repo_path,
    baseRef: input.baseRef,
    validationCommands: input.validationCommands,
  };
}