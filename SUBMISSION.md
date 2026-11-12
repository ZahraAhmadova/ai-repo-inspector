# Submission

## What did you investigate first, and why?
I first established the project's baseline by installing dependencies and running the TypeScript typecheck and existing tests. Both passed, but the repository initially had only one test, covering Markdown report generation.

I then investigated src/validation.ts, src/mcp-server.ts, and src/core.ts because command execution and the boundary between AI clients and the shared review logic seemed particularly important for production reliability and safety.

I found that the MCP tool declared repo_path but attempted to read input.repoPath. I also found that failed validation commands rejected the entire review rather than producing failed validation results.

## What did you choose to implement or fix?
1. MCP input correctness: Fixed the repository path mapping by introducing a typed toReviewRequest() adapter and added regression tests.

2. Validation reliability: Changed validation execution to return a failed result rather than rejecting when a command exits unsuccessfully.

3. Execution limits: Introduced a 30-second default timeout and a 1 MB output buffer limit. Made the timeout configurable for testing.

4. Report clarity: Updated Markdown reports to display PASSED and FAILED validation statuses.

5. MCP security boundary: Removed validation commands from the MCP tool's advertised input schema and prevented the MCP input adapter from forwarding unexpected validation commands.

6. Testing: Expanded the automated test suite from one test to eight tests.

## What did you intentionally not do?
I did not attempt to rewrite the entire repository or add unrelated features. I prioritized identifiable correctness, reliability, and security concerns that I could address and verify within the assessment time limit.

I did not redesign Git change detection or implement JSON output. I also did not replace shell-based validation execution with a sandboxed execution environment.

## Interface decision

- Decision: CLI-first / MCP-first / hybrid
Hybrid — CLI for developer-controlled validation and MCP for repository inspection.
- Primary user and execution environment:
Developers using the CLI locally, and AI coding agents inspecting repositories through a local stdio MCP server.
- Trust boundary and allowed capabilities:
The CLI allows developers to explicitly provide validation commands, while MCP is restricted to repository inspection and does not accept or forward validation commands. This reduces the risk of an AI client triggering arbitrary shell commands. Repository paths and contents are still treated as potentially untrusted inputs.
- Reliability, discoverability, latency/context, and output tradeoffs:
The CLI supports developer-controlled validation and writes the report to a file, making it useful for local workflows. MCP makes repository inspection discoverable to AI agents through a structured tool interface, but returning the entire Markdown report can consume significant context. Restricting MCP to inspection also avoids the additional latency and execution risks associated with validation commands.
- How supported interfaces remain consistent:
Both interfaces use the same reviewRepository() function and share the Git inspection and Markdown report generation logic. Their capabilities intentionally differ: the CLI supports explicit validation commands, while MCP does not.
- Evidence that would change this decision:
I would reconsider this design if usage data showed that developers primarily preferred one interface, or if a sandboxed execution environment with explicit permissions made MCP validation both safe and valuable.

## How did you use an AI coding agent?
I used ChatGPT to help investigate the code, identify potential weaknesses, propose focused changes, and design regression tests.
I reviewed the suggested changes, applied them in VS Code, ran the verification commands locally, and used the results to decide whether to continue.

## Where did you check, correct, or reject an AI suggestion? (required)
During development, I reconsidered the initial approach of allowing validation commands to be passed through the MCP interface. Although exposing validation execution to AI agents could make the tool more flexible, it also introduces a security risk: an AI client could trigger arbitrary shell commands through the server.

Instead of preserving this capability, I chose a more restrictive design. The CLI continues to support explicitly requested validation commands, while MCP is limited to repository inspection. I removed validation commands from the MCP tool schema and ensured the input adapter ignores them even if they are supplied unexpectedly.

I added regression tests to verify this boundary. This decision reflects a tradeoff between functionality and security: I preferred a smaller, clearly defined set of MCP capabilities over exposing unnecessary command execution.

ChatGPT initially suggested testing the execution timeout with a command that would run for approximately 35 seconds. I revised this approach with AI assistance by introducing a configurable timeout parameter, allowing the test to use a 200-millisecond limit while preserving the application's 30-second default.

This allowed me to verify timeout handling more efficiently without unnecessarily slowing down the test suite. I ran the automated tests to confirm that the revised approach worked.

## Commands used to verify the result, with outcomes
- npm install — completed successfully; npm reported dependency security advisories.
- npm run typecheck — passed.
- npm test — passed, with 8 tests across 3 test files.
Baseline comparison — the starter initially had 1 passing test; the final tested version had 8 passing tests.
- npm run inspector -- review --repo . --validate "node -e 'console.log(123)'" — generated a Markdown report correctly showing PASSED and output 123.
- npm run inspector -- review --repo . --validate "node -e 'process.exit(1)'" — the inspector completed and generated a Markdown report correctly showing the validation as FAILED.


## A blocker you hit and how you approached it
While adding regression tests, I encountered an issue with the test structure: a new test had accidentally been placed inside another test because of an incorrectly positioned closing bracket.
I reviewed the code structure, corrected the placement, and reran the tests to verify that the suite passed.
I also encountered a Git workflow issue when an edited file did not initially appear in VS Code's Source Control panel. I checked the file and saved it, after which the change appeared and could be committed normally.

## Known limitations and the next three things you would do
Known limitations:
CLI validation still executes shell commands without sandbox isolation.
The execution timeout does not guarantee termination of all child processes.
MCP behavior has unit-test coverage for input mapping and command restrictions, but has not been tested through a complete MCP client/server interaction.
The CLI advertises JSON as an output option, but the shared review function currently generates Markdown.
The generated reports could be improved to handle unusually large outputs and special Markdown characters.
Dependency installation reported security advisories that have not yet been individually investigated.

Next three things I would do:
1. Add automated CLI integration tests and end-to-end MCP tests to verify interface behavior and ensure advertised capabilities match implementation.
2. Improve validation command security with safer subprocess management, explicit permissions, and resource limits.
3. Fix the JSON output contract and improve report formatting, escaping, and output-size handling.

## Approximate focused-work time

- Start: 21:50
- Finish: 23:05
Total: ~75 minutes