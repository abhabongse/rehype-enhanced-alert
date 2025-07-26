import { builder } from "./builder.ts";

/**
 * Transforms blockquotes containing alerts into styled alert blocks using a custom callback function.
 * Alerts are identified by a syntax pattern within the first paragraph of a blockquote.
 *
 * @param options - Configuration object for the rehype plugin.
 * @return A transformer function that modifies the HAST tree.
 */
const rehypeEnhancedAlert = builder();
export default rehypeEnhancedAlert;
