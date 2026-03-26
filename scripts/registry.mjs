import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const registryRoot = path.join(repoRoot, 'registry');

const [, , command, ...args] = process.argv;

if (!command || command === '--help' || command === '-h') {
  printUsage();
  process.exit(0);
}

if (command === 'list') {
  await listItems();
  process.exit(0);
}

if (command === 'add') {
  await addItem(args);
  process.exit(0);
}

console.error(`Unknown registry command: ${command}`);
printUsage();
process.exit(1);

async function listItems() {
  const catalog = await loadJson(path.join(registryRoot, 'index.json'));

  for (const item of catalog.items) {
    console.log(`${item.name} - ${item.title}`);
    console.log(`  ${item.description}`);
  }
}

async function addItem(rest) {
  const [itemName, targetDir] = rest;

  if (!itemName || !targetDir) {
    console.error('Usage: pnpm registry:add <item-name> <target-dir>');
    process.exit(1);
  }

  const manifestPath = path.join(registryRoot, 'items', `${itemName}.json`);
  const manifest = await loadJson(manifestPath);
  const absoluteTargetDir = path.resolve(process.cwd(), targetDir);

  await mkdir(absoluteTargetDir, { recursive: true });

  for (const file of manifest.files) {
    const source = path.join(repoRoot, file.source);
    const target = path.join(absoluteTargetDir, file.target);

    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(source, target);
    console.log(`Copied ${file.source} -> ${path.relative(process.cwd(), target)}`);
  }

  await writeFile(
    path.join(absoluteTargetDir, '.registry-item.json'),
    `${JSON.stringify(
      {
        name: manifest.name,
        type: manifest.type,
        title: manifest.title,
        installedFrom: manifestPath,
        installedAt: new Date().toISOString()
      },
      null,
      2
    )}\n`
  );

  console.log(`Installed ${manifest.name} into ${absoluteTargetDir}`);
}

async function loadJson(filePath) {
  const source = await readFile(filePath, 'utf8');
  return JSON.parse(source);
}

function printUsage() {
  console.log('Registry commands:');
  console.log('  pnpm registry:list');
  console.log('  pnpm registry:add <item-name> <target-dir>');
}
