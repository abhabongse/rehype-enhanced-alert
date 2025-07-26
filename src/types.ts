/**
 * Type definitions for the {@linkcode [mod.ts].rehypeEnhancedAlert | rehypeEnhancedAlert} plugin.
 *
 * @module
 */

import type * as hast from "hast";

/**
 * Plugin options for the {@linkcode [mod.ts].rehypeEnhancedAlert | rehypeEnhancedAlert} plugin.
 * It can be either a simple set of options {@linkcode SimpleOptions}
 * or a callback function {@linkcode CreateAlertCallback}
 * which allows for extensive customizations.
 */
export type Options = SimpleOptions | CreateAlertCallback;

/**
 * A simple set of options for {@linkcode [mod.ts].rehypeEnhancedAlert | rehypeEnhancedAlert} plugin.
 */
export interface SimpleOptions {
  /**
   * List of allowed alert types (in lowercases) that would permit
   * a transformation of blockquote elements into alert boxes.
   * Conversely, if `[!TYPE]` is not one of the allowed types,
   * the blockquote element will be left untouched.
   *
   * Additionally, this option can be set to `true` to indicate that
   * all arbitrary strings are accepted as alert types.
   * However, setting this option to `false` will default to
   * a set of original GitHub-style alert types, which is the default behavior.
   *
   * See {@linkcode [builder.ts].DEFAULT_TYPES | DEFAULT_TYPES}
   * for the full list of the original set of allowed types.
   * To extend upon this list, use the array spread syntax:
   *
   * ```typescript
   * {
   *   allowedTypes: [...DEFAULT_TYPES, "error"]
   *   // ... other options
   * }
   * ```
   */
  allowedTypes?: boolean | string[];

  /**
   * Whether to allow custom headings on the first line
   * of the blockquote element after the `[!TYPE]` marker.
   *
   * When setting this option to `true` (default),
   * the content author may specify the custom heading for the alert box.
   * For example,
   *
   * ```markdown
   * > [!NOTE] Important Note
   * > Please do not litter.
   * ```
   *
   * The phrase _"Important Note"_ will become the heading display
   * instead of the default _"Note"_ (the capitalized form of the alert type).
   *
   * This is not how GitHub implements alert boxes.
   * If you wish to achieve parity with GitHub's implementation,
   * this option can be set to `false`.
   */
  allowsCustomHeading?: boolean;

  /**
   * The name and the prefix of CSS classes when styling alert boxes.
   * Defaults to _"alert"_.
   */
  classPrefix?: string;
}

/**
 * A callback function which is called by the plugin
 * to create an alert box element from function input parameters.
 *
 * An implementation of this callback function must return
 * a {@link https://github.com/syntax-tree/hast | HAST} node
 * representing the new alert block to replace the original blockquote element.
 *
 * Alternatively, it may return `false` to indicate that the blockquote should remain untouched,
 * and thus an alert block would not be created.
 * In such a case, the children argument should also be left untouched
 * by the callback function.
 *
 * It is possible to achieve any kind of configuration achievable by
 * the {@linkcode SimpleOptions} with this callback function.
 * In fact, you are encouraged to look at the source code to see how
 * a factory function creates a callback function out of {@linkcode SimpleOptions}.
 *
 * @param alertType Type of the alert that appeared between a pair of brackets, but transformed to lowercase.
 *   For example, the alert marker `[!HeLLo]` would be passed in as the alert type _"hello"_.
 * @param displayText Text that appears right after the alert type in brackets.
 *   This value usually represents a custom heading of the alert box,
 *   although it can be repurposed for other needs as well.
 * @param children The body content of the alert block.
 *    Avoid modifying this if the callback decides not to transform the blockquote element.
 * @returns Either a HAST node representing the complete alert block,
 *    or the boolean value `false` to skip creating the alert block altogether.
 */
export type CreateAlertCallback = (
  alertType: string,
  displayText: string,
  children: hast.ElementContent[],
) => hast.Element | false;
