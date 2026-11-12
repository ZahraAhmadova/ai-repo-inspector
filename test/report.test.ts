import { describe, expect, it } from "vitest";
import { markdownReport } from "../src/report.js";

describe("markdownReport", () => {
  it("lists changed files and validation output", () => {
    const report = markdownReport({
      repositoryPath: "/work/sample",
      changedFiles: [{ path: "src/index.ts", status: "modified" }],
      validationResults: [{ command: "npm test", status: "passed", output: "ok" }],
    });

    expect(report).toContain("src/index.ts (modified)");
    expect(report).toContain("npm test");
    expect(report).toContain("ok");
  });
  it("shows passed and failed validation statuses", () => {
    const report = markdownReport({
      repositoryPath: "/work/sample",
      changedFiles: [],
      validationResults: [
        { command: "npm test", status: "passed", output: "Tests passed" },
        { command: "npm run build", status: "failed", output: "Build failed" },
      ],
    });

    expect(report).toContain("### npm test — PASSED");
    expect(report).toContain("### npm run build — FAILED");
    expect(report).toContain("Tests passed");
    expect(report).toContain("Build failed");
  });
});