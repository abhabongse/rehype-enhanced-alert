import type * as hast from "hast";
import { whitespace } from "hast-util-whitespace";
import { h } from "hastscript";
import { visit } from "unist-util-visit";
import { is } from "unist-util-is";

import type { Options, CreateAlertCallback } from "./types.ts";

/*
 * Pattern that matches GitHub-style alert syntax at the beginning of a paragraph
 * followed by the optional display name of the alert.
 */
const alertRegex = /^\[!([A-Z]+)]([^\n]*)\n?/;

/** Default alert types */
const defaultTypes = ["note", "tip", "important", "warning", "caution"];

/**
 * Resolve a callback function for creating alert blocks based on provided options.
 * If the function is provided, return it as is.
 * Otherwise, create a default callback function based on the simple options.
 *
 * @param options - Configuration options determining how alert blocks are created and validated.
 * @return The callback function to create (or validate) alert blocks.
 */
function resolveCallback(options: Options): CreateAlertCallback {
  if (typeof options === "function") {
    return options;
  }
  const {
    allowedTypes = false,
    allowsCustomHeading = true,
    classPrefix = "alert",
  } = options;

  return function (
    alertType: string,
    displayText: string,
    children: hast.ElementContent[],
  ): hast.Element | false {
    // Validation #1. Check if the parsed alert type aligns with the allowed types
    function isAllowedType(type: string): boolean {
      if (allowedTypes === true) {
        return true;
      } else if (Array.isArray(allowedTypes)) {
        return allowedTypes.includes(type);
      } else {
        return defaultTypes.includes(type);
      }
    }

    if (!isAllowedType(alertType)) {
      return false;
    }

    // Validation #2. Check if the display text is allowed when it is present
    if (!allowsCustomHeading && !whitespace(displayText)) {
      return false;
    }
    const heading = displayText.trim() || capitalize(alertType);

    // Finally, create the alert block element with the specified type and content
    return h(`aside.${classPrefix}.${classPrefix}--${alertType}`, [
      h(`p.${classPrefix}-heading`, [
        h(`span.${classPrefix}-icon.${classPrefix}--${alertType}`),
        heading,
      ]),
      ...children,
    ]);
  };
}

/**
 * Uses this function to create a copy of Rehype Custom Alert plugin
 * so that it can be used multiple times with different configurations.
 *
 * @return A copy of Rehype Custom Alert plugin
 */
export function builder(): (options?: Options) => (tree: hast.Root) => void {
  return function (options: Options = {}): (tree: hast.Root) => void {
    const callback = resolveCallback(options);

    return function (tree: hast.Root): void {
      visit(
        tree,
        { type: "element", tagName: "blockquote" },
        function (bqNode, index, parent) {
          if (typeof index !== "number" || !parent) return;

          // Skips over whitespace-only child nodes at the beginning of the blockquote.
          // The first non-whitespace is called the "head".
          let headIndex = 0;
          while (
            headIndex < bqNode.children.length &&
            whitespace(bqNode.children[headIndex])
          ) {
            headIndex++;
          }
          const head = bqNode.children[headIndex];

          // VALIDATION: The head must be a paragraph node
          if (!is(head, { type: "element", tagName: "p" })) return;

          // VALIDATION: The first child of the paragraph must be a text node
          const text = head.children[0];
          if (!is(text, "text")) return;

          // VALIDATION: The text must start with the alert syntax pattern:
          // - It begins with "[!TYPE]" where TYPE is an uppercase string
          // - Followed by an optional display text until the first newline character.
          const match = text.value.match(alertRegex);
          if (!match || match.index === undefined) return;

          // Extracts the alert type and display text from the match.
          const alertType = match[1].toLowerCase();
          const displayText = match[2];

          // Special case: Parsing the alert type and display text consumes the entire text
          const endColumn = match.index + match[0].length;
          if (endColumn >= text.value.length) {
            const next = head.children[1];
            if (next) {
              // VALIDATION: If other siblings to the alert heading in the paragraph node exist,
              // we expect a line break <br> followed by more content.
              if (!is(next, { type: "element", tagName: "br" })) return;
              if (!head.children[2]) return;
            } else {
              // If there are no more siblings after the alert heading,
              // we need to recalculate where the rest of the children of the blockquote start.
              headIndex++; // Starting from the next note
              while (
                headIndex < bqNode.children.length &&
                whitespace(bqNode.children[headIndex])
              ) {
                headIndex++;
              }
              // VALIDATION: The rest of the blockquote should not be empty.
              // This would become the body content of the alert block.
              // VALIDATION: The next node must be an HTML element.
              if (
                headIndex === bqNode.children.length ||
                !is(bqNode.children[headIndex], "element")
              ) {
                return;
              }
            }
          }

          // Creates (and validates) the alert block element using the callback function.
          const newAlertNode = callback(
            alertType,
            displayText,
            bqNode.children.slice(headIndex),
          );
          // VALIDATION: The callback should return a valid HAST node (rather than `false`).
          if (!newAlertNode) {
            return;
          }

          // Post-processing the siblings to the alert block heading
          if (endColumn >= text.value.length) {
            const next = head.children[1];
            if (next) {
              // VALIDATION: If other siblings to the alert heading in the paragraph node exist,
              // everything after the <br> becomes the content of the alert.
              head.children = head.children.slice(2);
              // Also drops the '\n' character that typically (in markdown) follows <br>.
              const firstChild = head.children[0];
              if (
                is(firstChild, "text") &&
                firstChild.value.charAt(0) === "\n"
              ) {
                firstChild.value = firstChild.value.slice(1);
              }
            }
          } else {
            // Non-empty text still remains after the alert type and display text.
            // In such cases, split it into the body content of the alert block.
            text.value = text.value.slice(endColumn);
          }

          // Replace the blockquote with the alert block element.
          parent.children[index] = newAlertNode;
        },
      );
    };
  };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
