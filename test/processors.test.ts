import * as assert from "node:assert";
import { test } from "node:test";

import { defaultUsageProcessor } from "../examples/default-usage-processor.ts";
import { mixedPluginsProcessor } from "../examples/mixed-plugins-processor.ts";
import { getScenarios } from "./utils/fixture.ts";
import {
  allAlertTypesProcessor,
  customAlertTypesProcessor,
  customHeadingProcessor,
  roundtripHtmlProcessor,
} from "./utils/processors.ts";

const processors: Record<string, any> = {
  "default-usage": defaultUsageProcessor,
  "mixed-plugins": mixedPluginsProcessor,
  "custom-heading": customHeadingProcessor,
  "custom-alert-types": customAlertTypesProcessor,
  "all-alert-types": allAlertTypesProcessor,
};

const scenarios = await getScenarios();

for (const scenario of scenarios) {
  test(`should process "${scenario.name}" scenario with "${scenario.processor}" processor correctly`, async () => {
    const processor = processors[scenario.processor];
    const actualOutput = await processor.process(scenario.inputMarkdown);
    const expectedOutput = await roundtripHtmlProcessor.process(
      scenario.expectedHtml,
    );

    assert.strictEqual(
      String(actualOutput),
      String(expectedOutput),
      `Output for "${scenario.name}" scenario with "${scenario.processor}" processor does not match expected output.`,
    );
  });
}
