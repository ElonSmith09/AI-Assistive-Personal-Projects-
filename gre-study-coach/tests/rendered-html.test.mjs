import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("ships the installable adaptive GRE coach rather than starter content", async () => {
  const [coach, engine, layout, manifest, worker, hosting, builtHosting] = await Promise.all([
    readFile(new URL("../app/GreCoach.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/questionEngine.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"),
    readFile(new URL("../public/sw.js", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(new URL("../dist/.openai/hosting.json", import.meta.url), "utf8"),
  ]);

  assert.match(coach, /QUANTITATIVE REASONING LAB/);
  assert.match(coach, /VERBAL REASONING LAB/);
  assert.match(coach, /TIME \+ MASTERY TRACKER/);
  assert.match(coach, /YOUR TRAINING DESK/);
  assert.match(coach, /MISTAKE REVIEW/);
  assert.match(coach, /Install app/);
  assert.match(coach, /Next adaptive question/);
  assert.match(coach, /Same concept, fresh variation/);
  assert.match(coach, /STEP-BY-STEP FROM SCRATCH/);
  assert.match(coach, /give me a small hint/);
  assert.match(engine, /materializeQuestion/);
  assert.match(engine, /Easier \/ alternate way|alternate:/);
  assert.match(layout, /GRE Test Prep/);
  assert.equal(JSON.parse(manifest).display, "standalone");
  assert.match(worker, /gre-test-prep-v1/);
  assert.doesNotMatch(`${coach}\n${layout}`, /codex-preview|SkeletonPreview/);
  assert.equal(JSON.parse(hosting).d1, "DB");
  assert.equal(JSON.parse(builtHosting).d1, "DB");
});
