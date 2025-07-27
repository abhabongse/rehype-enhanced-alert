import { fileURLToPath } from "node:url";

import { builder as rehypeEnhancedAlert } from "@abhabongse/rehype-enhanced-alert/builder";
import type * as hast from "hast";
import { whitespace } from "hast-util-whitespace";
import { h } from "hastscript";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { createMain } from "./shared-main.ts";

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

const main = createMain(mixedPluginsProcessor);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
