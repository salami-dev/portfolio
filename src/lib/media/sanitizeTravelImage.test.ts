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
    const outputPath = join(directory, "sanitized.jpg");

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
    expect(sanitized.width).toBe(8);
    expect(sanitized.height).toBe(6);
  });

  it("rejects unsupported output formats", async () => {
    await expect(sanitizeTravelImage("source.jpg", "output.gif")).rejects.toThrow(
      "Supported output formats"
    );
  });
});
