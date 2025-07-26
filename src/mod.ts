import type * as hast from "hast";
import type { Plugin } from "unified";

import { builder } from "./builder.ts";
import type { Options } from "./types.ts";

/**
 * A {@link https://github.com/rehypejs/rehype | Rehype} plugin
 * which transforms some blockquote elements into alert boxes.
 *
 * @see {@link https://jsr.io/@abhabongse/rehype-enhanced-alert | Package Overview}
 * for a walkthrough on plugin features.
 *
 * @see {@linkcode Options} for API references on plugin options.
 */
export const rehypeEnhancedAlert: Plugin<[Options?], hast.Root> = builder();
