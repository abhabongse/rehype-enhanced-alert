import { fileURLToPath } from "node:url";

import { rehypeEnhancedAlert } from "@abhabongse/rehype-enhanced-alert";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { createMain } from "./shared-main.ts";

export const defaultUsageProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeEnhancedAlert)
  .use(rehypeStringify);

const main = createMain(defaultUsageProcessor);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
