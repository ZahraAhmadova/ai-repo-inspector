import { exec } from "node:child_process";
import type { ValidationResult } from "./types.js";

const TIMEOUT_MS = 30_000;
const MAX_BUFFER = 1024 * 1024;

export function runValidation(
  command: string,
  cwd: string,
  timeoutMs: number = TIMEOUT_MS,
): Promise<ValidationResult> {
  return new Promise((resolve) => {
    exec(
      command,
      {
        cwd,
        timeout: timeoutMs,
        maxBuffer: MAX_BUFFER,
      },
      (error, stdout, stderr) => {
        const status = error ? "failed" : "passed";

        const output =
          [stdout, stderr].filter(Boolean).join("\n").trim() ||
          (error ? error.message : "(no output)");

        resolve({
          command,
          status,
          output,
        });
      },
    );
  });
}

export async function runValidations(
  commands: string[],
  cwd: string,
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  for (const command of commands) {
    results.push(await runValidation(command, cwd));
  }

  return results;
}
