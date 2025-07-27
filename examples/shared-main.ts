import path from "node:path";

import type * as hast from "hast";
import type * as mdast from "mdast";
import { read } from "to-vfile";
import type { Processor } from "unified";

export function createMain(
  processor: Processor<mdast.Root, mdast.Root, hast.Root, hast.Root, string>,
) {
  return async function main() {
    const scriptName = path.basename(process.argv[1]);
    const inputMarkdownFile = process.argv[2];
    if (!inputMarkdownFile) {
      console.error(`Usage: node ${scriptName} <markdown-file>`);
      process.exit(1);
    }

    const htmlOutput = await processor.process(await read(inputMarkdownFile));

    console.log(String(htmlOutput));
  };
}
