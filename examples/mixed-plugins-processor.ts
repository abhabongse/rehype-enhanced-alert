import path from "node:path";
import { fileURLToPath } from "node:url";

import { builder as rehypeEnhancedAlert } from "@abhabongse/rehype-enhanced-alert/builder";
import type * as hast from "hast";
import { whitespace } from "hast-util-whitespace";
import { h } from "hastscript";
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
  if (!whitespace(displayText)) return false;

  return h(`aside.smallnote`, [
    h(`span.smallnote-icon`),
    " ",
    h("div.smallnote-body", children),
  ]);
}

export const mixedPluginsProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeEnhancedAlert(), smallnoteAlertConfig)
  .use(rehypeEnhancedAlert())
  .use(rehypeStringify);

async function main() {
  const scriptName = path.basename(process.argv[1]);
  const inputMarkdownFile = process.argv[2];
  if (!inputMarkdownFile) {
    console.error(`Usage: node ${scriptName} <markdown-file>`);
    process.exit(1);
  }

  const htmlOutput = await mixedPluginsProcessor.process(
    await read(inputMarkdownFile),
  );

  console.log(String(htmlOutput));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
