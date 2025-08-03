import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { glob } from "glob";
import { readSync } from "to-vfile";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const TEST_ROOT = path.join(__dirname, "..");
const FIXTURES_BASE_PATH = path.join(TEST_ROOT, "fixtures");

/**
 * Test scenario consisting of the following pair of files:
 * - an input Markdown file at `test/fixtures/{name}/input.md`
 * - an expected HTML file at `test/fixtures/{name}/{processor}.expected.md`
 */
export type TestScenario = {
  name: string;
  processor: string;
  inputMarkdown: string;
  expectedHtml: string;
};

/**
 * Automatically gathers a list of {@linkcode TestScenario}
 * located according to its test structure.
 */
export async function getTestScenarios(): Promise<TestScenario[]> {
  const scenarios: TestScenario[] = [];

  const subdirs = await glob("*", { cwd: FIXTURES_BASE_PATH });
  for (const name of subdirs) {
    const inputBaseDir = path.join(FIXTURES_BASE_PATH, name);
    const inputMarkdownPath = path.join(inputBaseDir, "input.md");
    if (!fs.existsSync(inputMarkdownPath)) continue;

    const expectedHtmlFiles = await glob("*.expected.html", {
      cwd: inputBaseDir,
    });
    for (const expectedHtmlFile of expectedHtmlFiles) {
      const expectedHtmlPath = path.join(inputBaseDir, expectedHtmlFile);
      const processor = path.basename(expectedHtmlFile, ".expected.html");
      const inputMarkdown = readSync(inputMarkdownPath).toString();
      const expectedHtml = readSync(expectedHtmlPath).toString();

      scenarios.push({
        name,
        processor,
        inputMarkdown,
        expectedHtml,
      });
    }
  }

  return scenarios;
}
