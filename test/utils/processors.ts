import rehypeEnhancedAlert from "@abhabongse/rehype-enhanced-alert";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

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
