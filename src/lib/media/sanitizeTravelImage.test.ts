import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { sanitizeTravelImage } from "../../../scripts/sanitize-travel-image.mjs";

describe("sanitizeTravelImage", () => {
  it("removes EXIF metadata while preserving a usable image", async () => {
    const directory = await mkdtemp(join(tmpdir(), "portfolio-travel-image-"));
    const inputPath = join(directory, "source.jpg");
    const outputPath = join(directory, "sanitized.webp");

    await sharp({
      create: {
        width: 8,
        height: 6,
        channels: 3,
        background: "#0f766e"
      }
    })
      .jpeg()
      .withExif({ IFD0: { Copyright: "private attribution" } })
      .toFile(inputPath);

    expect((await sharp(inputPath).metadata()).exif).toBeDefined();

    await sanitizeTravelImage(inputPath, outputPath);

    const sanitized = await sharp(await readFile(outputPath)).metadata();
    expect(sanitized.exif).toBeUndefined();
    expect(sanitized.format).toBe("webp");
    expect(sanitized.width).toBe(8);
    expect(sanitized.height).toBe(6);
  });

  it("reduces oversized camera images without enlarging the shorter edge", async () => {
    const directory = await mkdtemp(join(tmpdir(), "portfolio-travel-image-"));
    const inputPath = join(directory, "large-source.jpg");
    const outputPath = join(directory, "large-sanitized.webp");

    await sharp({
      create: {
        width: 3000,
        height: 2000,
        channels: 3,
        background: "#0f766e"
      }
    })
      .jpeg()
      .toFile(inputPath);

    await sanitizeTravelImage(inputPath, outputPath);

    const sanitized = await sharp(outputPath).metadata();
    expect(sanitized.width).toBe(2560);
    expect(sanitized.height).toBe(1707);
  });

  it("rejects output filenames that are not WebP", async () => {
    await expect(sanitizeTravelImage("source.jpg", "output.jpg")).rejects.toThrow(
      "must use the .webp extension"
    );
  });
});
