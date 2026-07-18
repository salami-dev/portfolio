import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";
import {
  addPhotoToGallery,
  reverseGeocodeCoordinates,
  resolvePhotoLocation,
  sanitizeTravelImage
} from "../../../scripts/sanitize-travel-image.mjs";

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

  it("uses embedded city and country without reverse geocoding", async () => {
    const reverseGeocode = vi.fn();

    await expect(
      resolvePhotoLocation(
        { City: "Accra", Country: "Ghana", latitude: 5.6037, longitude: -0.187 },
        reverseGeocode
      )
    ).resolves.toEqual({ city: "Accra", country: "Ghana", source: "embedded" });
    expect(reverseGeocode).not.toHaveBeenCalled();
  });

  it("resolves embedded GPS coordinates before they are stripped", async () => {
    const reverseGeocode = vi.fn().mockResolvedValue({ city: "Dakar", country: "Senegal" });

    await expect(
      resolvePhotoLocation({ latitude: 14.7167, longitude: -17.4677 }, reverseGeocode)
    ).resolves.toEqual({ city: "Dakar", country: "Senegal", source: "openstreetmap" });
    expect(reverseGeocode).toHaveBeenCalledWith({ latitude: 14.7167, longitude: -17.4677 });
  });

  it("adds the derived grouping fields to the gallery manifest", async () => {
    const directory = await mkdtemp(join(tmpdir(), "portfolio-travel-gallery-"));
    const galleryPath = join(directory, "gallery.json");
    await writeFile(galleryPath, '{"photos":[]}');

    await addPhotoToGallery(galleryPath, {
      image: "../../assets/travel/dakar.webp",
      alt: "Fishing boats drawn up on a beach.",
      location: "Dakar, Senegal",
      city: "Dakar",
      country: "Senegal",
      locationSource: "openstreetmap"
    });

    const gallery = JSON.parse(await readFile(galleryPath, "utf8"));
    expect(gallery.photos).toEqual([
      expect.objectContaining({ city: "Dakar", country: "Senegal", displayOrder: 10 })
    ]);
  });

  it("requests city-level reverse geocoding with an identifying user agent", async () => {
    const fetchImplementation = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ address: { city: "Kumasi", country: "Ghana" } })
    });

    await expect(
      reverseGeocodeCoordinates(
        { latitude: 6.6885, longitude: -1.6244 },
        { fetchImplementation, endpoint: "https://geo.example/reverse", userAgent: "portfolio-test" }
      )
    ).resolves.toEqual({ city: "Kumasi", country: "Ghana" });

    const [requestedUrl, request] = fetchImplementation.mock.calls[0];
    expect(requestedUrl.searchParams.get("zoom")).toBe("10");
    expect(requestedUrl.searchParams.get("format")).toBe("jsonv2");
    expect(request.headers["User-Agent"]).toBe("portfolio-test");
  });
});
