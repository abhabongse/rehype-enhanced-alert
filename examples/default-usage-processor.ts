import { fileURLToPath } from "node:url";

import { rehypeEnhancedAlert } from "@abhabongse/rehype-enhanced-alert";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { read } from "to-vfile";
import { unified } from "unified";

export const defaultUsageProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeEnhancedAlert)
  .use(rehypeStringify);

async function main() {
  const inputMarkdownFile = process.argv[2];
  if (!inputMarkdownFile) {
    console.error("Usage: node default-usage-processor.ts <markdown-file>");
    process.exit(1);
  }

  const htmlOutput = await defaultUsageProcessor.process(
    await read(inputMarkdownFile),
  );

  console.log(String(htmlOutput));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
