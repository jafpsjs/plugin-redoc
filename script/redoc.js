import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = resolve(join(import.meta.dirname, "..", "public"));
const redocDir = resolve(dirname(fileURLToPath(import.meta.resolve("redoc"))));

async function main() {
  const files = ["redoc.standalone.js"];
  for (const file of files) {
    let content = await readFile(join(redocDir, file), { encoding: "utf-8" });
    content = content.replaceAll(",src:\"https://cdn.redoc.ly/redoc/logo-mini.svg\"", "");
    await writeFile(join(publicDir, file), content, { encoding: "utf-8" });
  }
}


await main();
