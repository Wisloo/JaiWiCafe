import { mkdir, access, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { menu } from "../src/data/menu.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "menu");
const WIDTH = 1200;
const HEIGHT = 750;

const slugify = (name) =>
  name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const exists = async (file) => {
  try {
    await access(file, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of menu) {
    const slug = slugify(item.name);
    const dest = path.join(OUT_DIR, `${slug}.jpg`);

    if (!item.photo) {
      console.warn(`skip  ${slug} (no photo id)`);
      skipped++;
      continue;
    }

    if (await exists(dest)) {
      console.log(`have  ${slug}.jpg`);
      skipped++;
      continue;
    }

    const source = `https://images.unsplash.com/photo-${item.photo}?w=${WIDTH}&h=${HEIGHT}&fit=crop&q=80&fm=jpg`;

    try {
      const res = await fetch(source);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(dest, buf);
      console.log(`saved ${slug}.jpg (${(buf.length / 1024).toFixed(0)} KB)`);
      downloaded++;
    } catch (err) {
      console.error(`fail  ${slug}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n${downloaded} downloaded, ${skipped} skipped, ${failed} failed`);
  if (failed > 0) process.exitCode = 1;
}

main();
