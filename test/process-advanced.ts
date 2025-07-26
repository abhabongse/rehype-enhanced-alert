import * as assert from "node:assert";

import { builder as rehypeEnhancedAlert } from "@abhabongse/rehype-enhanced-alert/builder";
import type * as hast from "hast";
import { whitespace } from "hast-util-whitespace";
import { h } from "hastscript";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { read } from "to-vfile";
import { unified } from "unified";

function smallnoteAlertConfig(
  alertType: string,
  displayText: string,
  children: hast.ElementContent[],
): hast.Element | false {
  if (alertType !== "smallnote") return false;
  if (!whitespace(displayText)) return false; // disallows custom headings

  return h(`aside.smallnote`, [
    h(`span.smallnote-icon`),
    " ",
    h("div.smallnote-body", children),
  ]);
}

// Setup processors
const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeEnhancedAlert(), smallnoteAlertConfig)
  .use(rehypeEnhancedAlert())
  .use(rehypeStringify);

const roundtripHtmlProcessor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeStringify);

// Executes the Markdown processor on a sample Markdown file
const inputMarkdownFile = new URL("input-advanced.md", import.meta.url)
  .pathname;
const actualOutput = await markdownProcessor.process(
  await read(inputMarkdownFile),
);

// Reads the expected HTML output from a file
const expectedHtmlFile = new URL("expected-advanced.html", import.meta.url)
  .pathname;
const expectedOutput = await roundtripHtmlProcessor.process(
  (await read(expectedHtmlFile)).toString(),
);

// Compares the actual output with the expected output
assert.strictEqual(String(actualOutput), String(expectedOutput));
console.log("Test passed!");

// For debugging purposes, print the actual output
console.log("----- Output -----");
console.log(String(actualOutput));
