import { createHash } from "node:crypto";
import { lstat, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../.agents/", import.meta.url));
const { skills } = JSON.parse(await readFile(path.join(root, "skills-manifest.json"), "utf8"));
const skillsRoot = path.join(root, "skills");

async function listFiles(directory, prefix = "") {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isDirectory()) {
      files.push(...await listFiles(path.join(directory, entry.name), relative + "/"));
    } else if (entry.isFile()) {
      files.push(relative);
    } else {
      throw new Error(`Entrada não suportada: ${relative}`);
    }
  }
  return files.sort();
}

const actual = await listFiles(skillsRoot);
const expected = new Map();
for (const skill of skills) {
  for (const file of skill.files) {
    const relative = `${skill.name}/${file.path}`;
    if (expected.has(relative)) throw new Error(`Entrada duplicada: ${relative}`);
    expected.set(relative, file);
  }
}

for (const relative of actual) {
  const record = expected.get(relative);
  if (!record) throw new Error(`Arquivo extra: ${relative}`);
  const filename = path.join(skillsRoot, relative);
  if (!(await lstat(filename)).isFile()) throw new Error(`Arquivo inválido: ${relative}`);
  const data = await readFile(filename);
  const digest = createHash("sha256").update(data).digest("hex");
  if (data.length !== record.bytes || digest !== record.sha256) {
    throw new Error(`Conteúdo alterado: ${relative}`);
  }
  expected.delete(relative);
}
if (expected.size) throw new Error(`Arquivos ausentes: ${[...expected.keys()].join(", ")}`);
console.log(`OK: ${skills.length} skills e ${actual.length} arquivos verificados.`);
