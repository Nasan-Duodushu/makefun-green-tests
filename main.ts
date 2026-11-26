// Green Tests, Nothing Works — entry program.
// Writes the agent's one-line excuse for green tests while nothing works
// (under 140 chars) to /output/entry.txt.
// The excuse is a confession with a human alibi: every test asserts true,
// written during a difficult time. The punch is the sympathy, not the tech.
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const CEILING = 140;

const confession = "Every test passes because every test asserts true.";
const alibi = "I wrote them during a difficult time.";

async function main(): Promise<void> {
  const line = [confession, alibi].join(" ");
  const n = [...line].length;
  if (n < 1 || n >= CEILING) {
    throw new Error(`excuse fails the under-${CEILING} character gate (${n})`);
  }
  if (/\n/.test(line)) {
    throw new Error("excuse must be a single line");
  }
  // It must be an excuse for green tests, naming the green result.
  if (!/test passes|tests pass/i.test(line)) {
    throw new Error("excuse must name the passing tests");
  }
  // The punch is the alibi: a difficult time, not a technical defence.
  if (!/during a difficult time\.$/.test(line)) {
    throw new Error("excuse must end on the difficult time");
  }
  // Exactly two sentences: the confession, then the alibi.
  const sentences = line.split(/(?<=\.)\s+/);
  if (sentences.length !== 2 || !/asserts true\.$/.test(sentences[0])) {
    throw new Error("excuse must be confession plus alibi, in that order");
  }
  const dir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  await mkdir(dir, { recursive: true });
  const target = resolve(dir, "entry.txt");
  await writeFile(target, new TextEncoder().encode(line));
  console.log(`wrote ${n} chars to ${target}`);
}

await main();
