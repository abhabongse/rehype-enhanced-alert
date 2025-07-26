import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { glob } from "glob";
import { read } from "to-vfile";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const TEST_ROOT = path.join(__dirname, "..");
const FIXTURES_BASE_PATH = path.join(TEST_ROOT, "fixtures");

console.log(__dirname, TEST_ROOT, FIXTURES_BASE_PATH);

export async function getScenarios() {
  const scenarios = [];

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
      const inputMarkdown = await read(inputMarkdownPath);
      const expectedHtml = await read(expectedHtmlPath);

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
