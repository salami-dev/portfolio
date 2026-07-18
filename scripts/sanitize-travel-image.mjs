import { mkdir } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const outputFormats = {
  ".jpeg": { format: "jpeg", options: { quality: 88, mozjpeg: true } },
  ".jpg": { format: "jpeg", options: { quality: 88, mozjpeg: true } },
  ".png": { format: "png", options: { compressionLevel: 9 } },
  ".webp": { format: "webp", options: { quality: 88 } }
};

export async function sanitizeTravelImage(inputPath, outputPath) {
  const extension = extname(outputPath).toLowerCase();
  const output = outputFormats[extension];

  if (!output) {
    throw new Error("Supported output formats are .jpg, .jpeg, .png, and .webp.");
  }

  await mkdir(dirname(outputPath), { recursive: true });

  // Sharp removes EXIF, GPS, XMP, and other metadata unless keepMetadata or
  // withMetadata is requested. rotate() applies EXIF orientation to the pixels
  // before that metadata is discarded.
  await sharp(inputPath)
    .rotate()
    .toFormat(output.format, output.options)
    .toFile(outputPath);
}

async function run() {
  const [inputPath, requestedFilename] = process.argv.slice(2);

  if (!inputPath || !requestedFilename) {
    throw new Error(
      "Usage: npm run travel:photo -- <source-image> <output-filename.jpg>"
    );
  }

  if (basename(requestedFilename) !== requestedFilename) {
    throw new Error("The output filename must not contain a directory path.");
  }

  const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
  const outputPath = join(repositoryRoot, "src", "assets", "travel", requestedFilename);
  await sanitizeTravelImage(inputPath, outputPath);
  process.stdout.write(`Sanitized travel image written to ${outputPath}\n`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
