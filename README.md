# Enhanced Alert Boxes for Rehype

[![JSR][jsr:package/badge]][jsr:package/overview]

A [rehype][] plugin enabling [GitHub-style alert boxes][github-docs:alert]
in Markdown with enhanced features and customization.


## What is this?

This [unified][] ([rehype][]) plugin mimics how
[GitHub renders alert boxes in Markdown][github-docs:alert].
It allows content authors to reuse the blockquote syntax
to annotate alert boxes (a.k.a. callouts, admonitions, asides, info boxes).
In the words of [GitHub Docs][github-docs:alert]:

> “Alerts are a Markdown extension based on the blockquote syntax
> that you can use to emphasize critical information.”

The plugin scans for blockquote elements in the HTML content
and looks for a special marker `[!TYPE]` at the start of the first line.
When it finds this marker, it transforms the blockquote element
into a different HTML structure which can be styled as an alert box.

This plugin is based on the [rehype-github-alert][] plugin,
but with more features and customization options, whether it be simple styling
or a more complex construction of HTML elements representing the alert boxes.


## When should I use this?

This plugin helps you author Markdown content with alert boxes
without resorting to a more complex [remark-directive][] plugin.
By sharing the same syntax as GitHub alerts,
you can expect your Markdown content to render properly
both on GitHub and on web platforms you develop.


## Example Usage

Let’s look at how this plugin interacts with Markdown content.
Say our Markdown content looks like this:

```markdown
> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
```

Without this plugin, the Markdown content would render
as a series of blockquotes.
Using [remark-rehype][], converting the above Markdown example
into HTML would look like this:

```html
<blockquote>
<p>[!NOTE]
Useful information that users should know, even when skimming content.</p>
</blockquote>
<blockquote>
<p>[!TIP]
Helpful advice for doing things better or more easily.</p>
</blockquote>
<blockquote>
<p>[!IMPORTANT]
Key information users need to know to achieve their goal.</p>
</blockquote>
<blockquote>
<p>[!WARNING]
Urgent info that needs immediate user attention to avoid problems.</p>
</blockquote>
```

However, with this plugin enabled,
the same Markdown content would be transformed into HTML like this:

```html
<aside class="alert alert--note"><p class="alert-heading"><span class="alert-icon alert--note"></span>Note</p><p>Useful information that users should know, even when skimming content.</p>
</aside>
<aside class="alert alert--tip"><p class="alert-heading"><span class="alert-icon alert--tip"></span>Tip</p><p>Helpful advice for doing things better or more easily.</p>
</aside>
<aside class="alert alert--important"><p class="alert-heading"><span class="alert-icon alert--important"></span>Important</p><p>Key information users need to know to achieve their goal.</p>
</aside>
<aside class="alert alert--warning"><p class="alert-heading"><span class="alert-icon alert--warning"></span>Warning</p><p>Urgent info that needs immediate user attention to avoid problems.</p>
</aside>
<aside class="alert alert--caution"><p class="alert-heading"><span class="alert-icon alert--caution"></span>Caution</p><p>Advises about risks or negative outcomes of certain actions.</p>
</aside>
```

With [proper styling](./examples/github.css)
(*not* provided out-of-the-box by this plugin),
you can achieve a desired outcome such as in this example below.

![Example Alert Boxes](examples/github.svg)

This plugin offers extensive customization options beyond the default setup.
You can tailor its behavior and appearance to fit your needs.
See the [Advanced Features](#advanced-features) section below
to learn more.


## Installation

Head over to the [package home page on JSR][jsr:package/overview]
on how to install the plugin package.

```sh
# Install with npm 
npx jsr add @abhabongse/rehype-enhanced-alert

# Install with pnpm 10.9+
pnpm i jsr:@abhabongse/rehype-enhanced-alert

# Install with pnpm (older versions)
pnpm dlx jsr add @abhabongse/rehype-enhanced-alert

# Install with yarn 4.9+
yarn add jsr:@abhabongse/rehype-enhanced-alert

# Install with yarn (older versions)
yarn dlx jsr add @abhabongse/rehype-enhanced-alert

# Install with deno
deno add jsr:@abhabongse/rehype-enhanced-alert

# Install with bun
bunx jsr add @abhabongse/rehype-enhanced-alert
```

To use the plugin in your pipeline,
consult the relevant documentation with the keyword [rehype][].

- [Astro](https://docs.astro.build/en/guides/markdown-content/#adding-remark-and-rehype-plugins)
- [MDX](https://mdxjs.com/docs/extending-mdx/#using-plugins)
- [Next.js](https://nextjs.org/docs/app/guides/mdx#remark-and-rehype-plugins)
- [Nuxt Content](https://content.nuxt.com/docs/getting-started/configuration#rehypeplugins)


## Advanced Features

All plugin features can be customized via [`Options`][docs:options].

```typescript
type Options = SimpleOptions | CreateAlertCallback;

interface SimpleOptions {
  allowedTypes?: boolean | string[];
  allowsCustomHeading?: boolean;
  classPrefix?: string;
}

type CreateAlertCallback = (
  alertType: string,
  displayText: string,
  children: hast.ElementContent[],
) => hast.Element | false;
```

In this section, let’s walk through each feature and how to enable them.
Visit [API reference][jsr:package/api-reference] for more details.

### Feature: Custom Heading

By default, the plugin allows custom heading
right after the alert type marker `[!TYPE]`.
For example,

```markdown
> [!NOTE] Important Note
> Useful information that users should know, even when skimming content.
```

Yields:

```html
<aside class="alert alert--note"><p class="alert-heading"><span class="alert-icon alert--note"></span>Important Note</p><p>Useful information that users should know, even when skimming content.</p>
</aside> 
```

To disable this feature, set the option [`allowsCustomHeading`][docs:option/allowsCustomHeading] to `false`.
With this option disabled, the plugin will *not* transform the blockquote into an alert box.

### Feature: Add Custom Alert Types

By default, only these alert types are supported (reflecting the original implementation by GitHub):
`note`, `tip`, `important`, `warning`, and `caution`.

To add custom alert types, use the [`allowedTypes`][docs:option/allowedTypes] option
to specify a list of allowed alert types.
If you wish to keep the original alert types, you must also include them in the list.

Suppose that [`allowedTypes`][docs:option/allowedTypes] is set to `["note", "example"]`.
The following Markdown content:

```markdown
> [!NOTE]
> This is a note alert box.

> [!IMPORTANT]
> This is an important alert box.

> [!EXAMPLE]
> This is an example alert box.

> [!THANKS]
> This is a thanks alert box.
```

Yields:

```html
<aside class="alert alert--note"><p class="alert-heading"><span class="alert-icon alert--note"></span>Note</p><p>This is a note alert box.</p>
</aside>
<blockquote>
<p>[!IMPORTANT]
This is an important alert box.</p>
</blockquote>
<aside class="alert alert--example"><p class="alert-heading"><span class="alert-icon alert--example"></span>Example</p><p>This is an example alert box.</p>
</aside>
<blockquote>
<p>[!THANKS]
This is a thanks alert box.</p>
</blockquote>
```

**Important:** Alert type markers `[!TYPE]` are case-insensitive by themselves.
It may only consist of alphanumeric characters (uppercases A-Z, lowercases a-z, and digits 0-9).
These alert types will be normalized into lowercase forms before
being checked against the list of allowed types ([`allowedTypes`][docs:option/allowedTypes]).
The generated class names will reuse their lowercase forms as well.
Therefore, we recommend using lowercase alphabets for the alert type names
in the [`allowedTypes`][docs:option/allowedTypes] option
to maintain consistency and avoid confusion.

**Note:** When the custom heading is left unspecified in the first line of the blockquote,
the plugin will auto-capitalize the alert type name as the display heading.

### Feature: Allow All Alert Types

To allow all alert types, set the [`allowedTypes`][docs:option/allowedTypes] option
to the boolean `true`.
This will allow any alert type marker in the blockquote content
to be transformed into an alert box.
Also, the alert type names will be in lowercases when appear in class names.

Continuing from the previous example of the Markdown content,
setting [`allowedTypes`][docs:option/allowedTypes] to `true` will yield:

```html
<aside class="alert alert--note"><p class="alert-heading"><span class="alert-icon alert--note"></span>Note</p><p>This is a note alert box.</p>
</aside>
<aside class="alert alert--important"><p class="alert-heading"><span class="alert-icon alert--important"></span>Important</p><p>This is an important alert box.</p>
</aside>
<aside class="alert alert--example"><p class="alert-heading"><span class="alert-icon alert--example"></span>Example</p><p>This is an example alert box.</p>
</aside>
<aside class="alert alert--thanks"><p class="alert-heading"><span class="alert-icon alert--thanks"></span>Thanks</p><p>This is a thanks alert box.</p>
</aside>
```

**Note:** In case you are curious, the option [`allowedTypes`][docs:option/allowedTypes]
is set to `false` as the default value,
meaning that only the default alert types are allowed.

### Feature: Change Class Name Prefixes

By default, the plugin uses `alert` as the main class name of the `<aside>` element
as well as the prefix for relevant class names
such as `alert-icon`, `alert-heading`, `alert--note`, `alert--tip`, etc.

This value can be replaced with a custom value by setting the [`classPrefix`][docs:option/classPrefix] option.

For example, setting the [`classPrefix`][docs:option/classPrefix] to *"callout"* will transform:

```markdown
> [!NOTE]
> This is a note alert box.
```

into:

```html
<aside class="callout callout--note"><p class="callout-heading"><span class="callout-icon callout--note"></span>Note</p><p>This is a note alert box.</p>
</aside>
```

### Feature: Custom HTML Element

You can ignore all the above options and provide a custom HTML structure
for the alert boxes specifying the callback function as the plugin options.

For example, one might want to create a custom alert box
that inlines the body content with the icon.
To achieve this, you can define the callback function like this:

```typescript
import type * as hast from "hast";
import {whitespace} from "hast-util-whitespace";
import {h} from "hastscript";

function createSmallnoteAlert(
  alertType: string,
  displayText: string,
  children: hast.ElementContent[],
): hast.Element | false {
  // Only process alert type called "smallnote"
  if (alertType !== "smallnote") return false;
  // Disallows custom headings (effectively set allowsCustomHeading to false)
  if (!whitespace(displayText)) return false;

  return h(`aside.smallnote`, [
    h(`span.smallnote-icon`),
    " ",
    h("div.smallnote-body", children),
  ]);
}
```

With the above callback function, the following Markdown content:

```markdown
> [!SMALLNOTE]
> Your content goes here.
```

Yields:

```html
<aside class="smallnote"><span class="smallnote-icon"></span> <div class="smallnote-body"><p>Your content goes here.</p></div>
</aside>
```

### Feature: Using This Plugin More Than Once

Suppose that you are inspired by [the previous feature](#feature-custom-html-element)
and wish to configure your rehype pipeline to use this plugin twice,
once for the `smallnote` alert type and again for the default set of alert types (very cool idea!).

Due to the way the [unified][] ecosystem works,
typically you cannot repeat the same plugin in the pipeline.
However, this plugin provides a special mechanism to create new instances of the plugin
via the `builder()` function under `@abhabongse/rehype-enhanced-alert/builder` entrypoint.

Hence, you can achieve the aforementioned goal by doing the following:

```typescript
import { builder as rehypeEnhancedAlert } from "@abhabongse/rehype-enhanced-alert/builder";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export const mixedPluginsProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeEnhancedAlert(), createSmallnoteAlert)
  .use(rehypeEnhancedAlert(), { allowedTypes: true })
  .use(rehypeStringify);
```


## API Reference

Head over to the [JSR package documentation][jsr:package/api-reference] for the full API documentation.


## Help, Support, and Contribute

If you are a user of this package, I would like to hear from you!
[Create a discussion thread][github:package/discussion]
or send me a direct message if you have feedback or suggestions.


## License

[Apache-2.0](./LICENSE) © Abhabongse Janthong

<!-- Definitions -->

[docs:option/allowedTypes]: https://jsr.io/@abhabongse/rehype-enhanced-alert/doc/types/~/SimpleOptions#property_allowedtypes

[docs:option/allowsCustomHeading]: https://jsr.io/@abhabongse/rehype-enhanced-alert/doc/types/~/SimpleOptions#property_allowscustomheading

[docs:option/classPrefix]: https://jsr.io/@abhabongse/rehype-enhanced-alert/doc/types/~/SimpleOptions#property_classprefix

[docs:options]: https://jsr.io/@abhabongse/rehype-enhanced-alert/doc/types/~/Options

[esm.sh]: https://esm.sh/

[github:package/discussion]: https://github.com/abhabongse/rehype-enhanced-alert/discussions

[github-docs:alert]: https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts

[jsr:package/api-reference]: https://jsr.io/@abhabongse/rehype-enhanced-alert/doc

[jsr:package/badge]: https://jsr.io/badges/@abhabongse/rehype-enhanced-alert

[jsr:package/overview]: https://jsr.io/@abhabongse/rehype-enhanced-alert

[octicons]: https://github.com/primer/octicons

[rehype]: https://github.com/rehypejs/rehype

[rehype-github-alert]: https://github.com/rehypejs/rehype-github/tree/main/packages/alert

[remark-directive]: https://github.com/remarkjs/remark-directive

[remark-rehype]: https://github.com/remarkjs/remark-rehype

[unified]: https://github.com/unifiedjs/unified
