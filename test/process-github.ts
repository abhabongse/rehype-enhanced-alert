import * as assert from "node:assert";

import rehypeEnhancedAlert from "@abhabongse/rehype-enhanced-alert";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { read } from "to-vfile";
import { unified } from "unified";

// Setup processors
const normalProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify);

const rehypeEnhancedAlertProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeEnhancedAlert)
  .use(rehypeStringify);

const roundtripHtmlProcessor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeStringify);

// Executes the Markdown processor on a sample Markdown file
const inputMarkdownFile = new URL("input-github.md", import.meta.url).pathname;
const blockquoteOutput = await normalProcessor.process(
  await read(inputMarkdownFile),
);
const alertOutput = await rehypeEnhancedAlertProcessor.process(
  await read(inputMarkdownFile),
);

// Reads the expected HTML output from a file
const expectedHtmlFile = new URL("expected-github.html", import.meta.url);
const expectedOutput = await roundtripHtmlProcessor.process(
  (await read(expectedHtmlFile)).toString(),
);

// Compares the actual output with the expected output
assert.strictEqual(String(alertOutput), String(expectedOutput));
console.log("Test passed!");

// For debugging purposes, print the actual output comparing blockquote and alert outputs
console.log("\n----- Original Output -----");
console.log(String(blockquoteOutput));

console.log("\n----- Transformed Output with Alert Boxes -----");
console.log(String(alertOutput));
