import { describe, expect, it } from "vitest";
import { runValidation, runValidations } from "../src/validation.js";

describe("validation execution", () => {
  it("records a successful command", async () => {
    const result = await runValidation(
      'node -e "console.log(123)"',
      process.cwd(),
    );

    expect(result.status).toBe("passed");
    expect(result.output).toContain("123");
  });

  it("records a failed command without throwing", async () => {
    const result = await runValidation(
      'node -e "process.exit(1)"',
      process.cwd(),
    );

    expect(result.status).toBe("failed");
  });

  it("continues after a failed validation", async () => {
    const results = await runValidations(
      [
        'node -e "process.exit(1)"',
        'node -e "console.log(456)"',
      ],
      process.cwd(),
    );

    expect(results).toHaveLength(2);
    expect(results[0].status).toBe("failed");
    expect(results[1].status).toBe("passed");
    expect(results[1].output).toContain("456");
  });
});
