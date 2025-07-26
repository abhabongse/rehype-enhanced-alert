import { fileURLToPath } from "node:url";

import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { read } from "to-vfile";
import { unified } from "unified";

const defaultProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify);

async function main() {
  const inputMarkdownFile = process.argv[2];
  if (!inputMarkdownFile) {
    console.error("Usage: node noop-processor.ts <markdown-file>");
    process.exit(1);
  }

  const htmlOutput = await defaultProcessor.process(
    await read(inputMarkdownFile),
  );

  console.log(String(htmlOutput));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
