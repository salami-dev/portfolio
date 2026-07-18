import { mkdir } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const maximumImageEdge = 2560;
const webpOptions = {
  quality: 82,
  alphaQuality: 90,
  effort: 4,
  smartSubsample: true
};

export async function sanitizeTravelImage(inputPath, outputPath) {
  const extension = extname(outputPath).toLowerCase();

  if (extension !== ".webp") {
    throw new Error("The output filename must use the .webp extension.");
  }

  await mkdir(dirname(outputPath), { recursive: true });

  // Sharp removes EXIF, GPS, XMP, and other metadata unless keepMetadata or
  // withMetadata is requested. rotate() applies EXIF orientation to the pixels
  // before that metadata is discarded.
  await sharp(inputPath)
    .rotate()
    .resize({
      width: maximumImageEdge,
      height: maximumImageEdge,
      fit: "inside",
      withoutEnlargement: true
    })
    .webp(webpOptions)
    .toFile(outputPath);
}

async function run() {
  const [inputPath, requestedFilename] = process.argv.slice(2);

  if (!inputPath || !requestedFilename) {
    throw new Error(
      "Usage: npm run travel:photo -- <source-image> <output-filename.webp>"
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
