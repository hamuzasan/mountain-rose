import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

import {
  cataloguePageImageMap,
} from "../data/import/mountainRoseCatalogueProducts";

const sourcePdfPath = resolve(
  process.cwd(),
  "data/source/mountain-rose-product-catalogue.pdf",
);
const outputDir = resolve(process.cwd(), "data/generated/catalogue-pages");

function resolveWinGetPopplerBinary(exeName: string) {
  const localAppData = process.env.LOCALAPPDATA;
  if (!localAppData) return null;

  const packagesDir = join(localAppData, "Microsoft", "WinGet", "Packages");
  if (!existsSync(packagesDir)) return null;

  let candidates: string[] = [];
  try {
    candidates = readdirSync(packagesDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.startsWith("oschwartz10612.Poppler_"))
      .map((d) => d.name);
  } catch {
    return null;
  }

  for (const dirName of candidates) {
    // winget extracts Poppler under: <pkg>/poppler-*/Library/bin/<exe>
    const pkgRoot = join(packagesDir, dirName);
    let entries: string[] = [];
    try {
      entries = readdirSync(pkgRoot, { withFileTypes: true })
        .filter((d) => d.isDirectory() && d.name.startsWith("poppler-"))
        .map((d) => d.name);
    } catch {
      continue;
    }

    for (const entry of entries) {
      const resolvedExe = join(pkgRoot, entry, "Library", "bin", exeName);
      if (existsSync(resolvedExe)) return resolvedExe;
    }
  }

  return null;
}

function resolveCommand(command: string) {
  if (process.platform === "win32") {
    const probe = spawnSync("where.exe", [command], {
      shell: false,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    if (probe.status === 0 && typeof probe.stdout === "string") {
      const first = probe.stdout.split(/\r?\n/).map((l) => l.trim()).find(Boolean);
      return first || null;
    }

    if (command.toLowerCase() === "pdftoppm") {
      return resolveWinGetPopplerBinary("pdftoppm.exe");
    }

    return null;
  }

  const probe = spawnSync("which", [command], {
    shell: false,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  if (probe.status === 0 && typeof probe.stdout === "string") {
    const resolved = probe.stdout.trim();
    return resolved ? resolved : null;
  }
  return null;
}

function ensureDir(pathname: string) {
  mkdirSync(pathname, { recursive: true });
}

function renderWithPdfToPpm(pdftoppmPath: string) {
  for (const item of cataloguePageImageMap) {
    const outputBase = join(outputDir, item.slug);
    const result = spawnSync(
      pdftoppmPath,
      [
        "-f",
        String(item.sourcePdfPage),
        "-l",
        String(item.sourcePdfPage),
        "-png",
        sourcePdfPath,
        outputBase,
      ],
      { stdio: "inherit" },
    );

    if (result.status !== 0) {
      throw new Error(`pdftoppm failed on page ${item.sourcePdfPage}.`);
    }

    const expected = join(outputDir, item.outputFileName);
    const prefix = `${item.slug}-`;
    const generatedFile =
      readdirSync(outputDir, { withFileTypes: true })
        .filter((d) => d.isFile())
        .map((d) => d.name)
        .find((name) => name.startsWith(prefix) && name.endsWith(".png")) || null;

    if (!generatedFile) {
      throw new Error(`Unable to find rendered output for ${item.slug}.`);
    }

    try {
      rmSync(expected, { force: true });
      renameSync(join(outputDir, generatedFile), expected);
    } catch {
      throw new Error(`Unable to rename rendered page for ${item.slug}.`);
    }
  }
}

function renderWithMagick(magickPath: string) {
  for (const item of cataloguePageImageMap) {
    const outputPath = join(outputDir, item.outputFileName);
    const pageIndex = item.sourcePdfPage - 1;
    const result = spawnSync(
      magickPath,
      ["-density", "220", `${sourcePdfPath}[${pageIndex}]`, outputPath],
      { stdio: "inherit" },
    );

    if (result.status !== 0) {
      throw new Error(`ImageMagick failed on page ${item.sourcePdfPage}.`);
    }
  }
}

function printManualFallback() {
  console.error("No supported PDF renderer was found.");
  console.error("Install `pdftoppm` or ImageMagick (`magick`) and run the script again.");
  console.error("Manual fallback:");
  console.error(`1. Export pages 2-10 from ${sourcePdfPath}`);
  console.error(`2. Save them into ${outputDir}`);
  console.error("3. Use these filenames:");
  for (const item of cataloguePageImageMap) {
    console.error(`   - ${item.outputFileName}`);
  }
}

function main() {
  if (!existsSync(sourcePdfPath)) {
    console.error("Catalogue PDF was not found.");
    console.error(`Place it here: ${sourcePdfPath}`);
    process.exitCode = 1;
    return;
  }

  ensureDir(outputDir);

  try {
    const pdftoppmPath = resolveCommand("pdftoppm");
    if (pdftoppmPath) {
      renderWithPdfToPpm(pdftoppmPath);
      console.log(`Rendered ${cataloguePageImageMap.length} catalogue pages to ${outputDir}`);
      return;
    }

    const magickPath = resolveCommand("magick");
    if (magickPath) {
      renderWithMagick(magickPath);
      console.log(`Rendered ${cataloguePageImageMap.length} catalogue pages to ${outputDir}`);
      return;
    }

    printManualFallback();
    process.exitCode = 1;
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Unable to render catalogue pages.",
    );
    process.exitCode = 1;
  }
}
main();
