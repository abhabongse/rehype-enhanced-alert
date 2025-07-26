/**
 * Type definitions for the plugin.
 */

import type * as hast from "hast";

/**
 *
 *
 * Plugin option for the plugin.
 * It can either be a simple set of options or a callback function
 * (see definitions of respective types below).
 */
export type Options = SimpleOptions | CreateAlertCallback;

/**
 * Simple set of options for rehypeCustomAlert plugin.
 */
export interface SimpleOptions {
  /**
   * List of allowed alert types (in lowercases) to transform blockquotes into alert blocks.
   * However, if set to `true`, all arbitrary strings are allowed as alert types.
   * Otherwise, it defaults to a set of original GitHub-style alert types:
   * "note", "tip", "important", "warning", and "caution".
   */
  allowedTypes?: boolean | string[];
  /**
   * This options enables optional customization of the alert heading when set to `true` (which is the default).
   * Under this option, the plugin will use the display text that appears after the alert type in brackets,
   * or will use the capitalized alert type as the display text as a fallback.
   *
   * However, if set to `false`, the plugin will not allow any customization of the alert heading,
   * which aligns with the original GitHub-style alert syntax.
   */
  allowsCustomHeading?: boolean;
  /**
   * Prefix for the CSS classes applied to the alert blocks (defaults to "alert").
   */
  classPrefix?: string;
}

/**
 * A callback function to create an alert block element.
 * It should return the HAST-compatible HTML node for the alert block
 * or `false` to indicate that the alert block should *not* be created.
 *
 * @param alertType - Type of the alert appeared inside a pair of brackets, transformed to lowercase.
 *    (e.g. the blockquote beginning with > [!NOTE] would produce the alert type called "note").
 * @param displayText - Text that appears right after the alert type in brackets.
 * @param children - The body content of the alert block.
 *    Avoid modifying this if the callback decides not to produce an alert block.
 * @returns Either a HAST node representing the complete alert block,
 *    or the boolean value `false` to skip creating the alert block altogether.
 */
export type CreateAlertCallback = (
  alertType: string,
  displayText: string,
  children: hast.ElementContent[],
) => hast.Element | false;

export default {};
