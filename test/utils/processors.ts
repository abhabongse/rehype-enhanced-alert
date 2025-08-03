import { rehypeEnhancedAlert } from "@abhabongse/rehype-enhanced-alert";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// DEVNOTE: Avoid premature overengineering by refactoring the plugin options.
// Some processors didn't adhere to the usual pipeline of:
// remarkParse > remarkRehype > rehypeEnhancedAlert > rehypeStringify
// such as mixedPluginProcessor with double usage of rehypeEnhancedAlert.

export const roundtripHtmlProcessor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeStringify);

export const customHeadingProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeEnhancedAlert, { allowsCustomHeading: false })
  .use(rehypeStringify);

export const customAlertTypesProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeEnhancedAlert, { allowedTypes: ["note", "example"] })
  .use(rehypeStringify);

export const allAlertTypesProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeEnhancedAlert, { allowedTypes: true })
  .use(rehypeStringify);
