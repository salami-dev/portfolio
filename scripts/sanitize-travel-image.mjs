import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parse as parseImageMetadata } from "exifr";
import sharp from "sharp";

const maximumImageEdge = 2560;
const webpOptions = {
  quality: 82,
  alphaQuality: 90,
  effort: 4,
  smartSubsample: true
};
const defaultGeocoderUrl = "https://nominatim.openstreetmap.org/reverse";
const defaultGeocoderUserAgent =
  "bashir-salami-portfolio-photo-import/1.0 (+https://github.com/salami-dev)";

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export async function resolvePhotoLocation(metadata, reverseGeocode) {
  const embeddedCity = nonEmptyString(
    metadata.City ?? metadata.city ?? metadata["Sub-location"] ?? metadata.Location
  );
  const embeddedCountry = nonEmptyString(
    metadata.Country ??
      metadata.country ??
      metadata["Country-PrimaryLocationName"] ??
      metadata.CountryName
  );
  const latitude = Number(metadata.latitude);
  const longitude = Number(metadata.longitude);
  const hasCoordinates =
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180;

  if (embeddedCity && embeddedCountry) {
    return { city: embeddedCity, country: embeddedCountry, source: "embedded" };
  }

  if (hasCoordinates) {
    const resolved = await reverseGeocode({ latitude, longitude });
    return {
      city: embeddedCity ?? resolved.city,
      country: embeddedCountry ?? resolved.country,
      source: "openstreetmap"
    };
  }

  return {
    ...(embeddedCity && { city: embeddedCity }),
    ...(embeddedCountry && { country: embeddedCountry }),
    source: embeddedCity || embeddedCountry ? "embedded" : "none"
  };
}

export async function reverseGeocodeCoordinates(
  { latitude, longitude },
  {
    fetchImplementation = fetch,
    endpoint = process.env.TRAVEL_GEOCODER_URL ?? defaultGeocoderUrl,
    userAgent = process.env.TRAVEL_GEOCODER_USER_AGENT ?? defaultGeocoderUserAgent
  } = {}
) {
  const url = new URL(endpoint);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("zoom", "10");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("layer", "address");

  const response = await fetchImplementation(url, {
    headers: {
      "Accept-Language": "en",
      "User-Agent": userAgent
    },
    signal: AbortSignal.timeout(10_000)
  });

  if (!response.ok) {
    throw new Error(`Location lookup failed with HTTP ${response.status}.`);
  }

  const payload = await response.json();
  const address = payload?.address;
  const country = nonEmptyString(address?.country);
  const city = nonEmptyString(
    address?.city ?? address?.town ?? address?.village ?? address?.municipality ?? address?.county
  );

  if (!country) {
    throw new Error("Location lookup returned no country for the embedded GPS coordinates.");
  }

  return { ...(city && { city }), country };
}

async function readGeocodeCache(cachePath) {
  try {
    return JSON.parse(await readFile(cachePath, "utf8"));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return { lastRequestAt: 0, locations: {} };
    }
    throw error;
  }
}

async function reverseGeocodeWithCache(coordinates, cachePath) {
  const coordinateKey = createHash("sha256")
    .update(`${coordinates.latitude.toFixed(5)},${coordinates.longitude.toFixed(5)}`)
    .digest("hex");
  const cache = await readGeocodeCache(cachePath);
  const cachedLocation = cache.locations?.[coordinateKey];

  if (cachedLocation) {
    return cachedLocation;
  }

  const waitMilliseconds = Math.max(0, 1_000 - (Date.now() - (cache.lastRequestAt ?? 0)));
  if (waitMilliseconds > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitMilliseconds));
  }

  const location = await reverseGeocodeCoordinates(coordinates);
  await mkdir(dirname(cachePath), { recursive: true });
  await writeFile(
    cachePath,
    `${JSON.stringify(
      {
        lastRequestAt: Date.now(),
        locations: { ...(cache.locations ?? {}), [coordinateKey]: location }
      },
      null,
      2
    )}\n`
  );
  return location;
}

export async function addPhotoToGallery(galleryPath, photo) {
  const gallery = JSON.parse(await readFile(galleryPath, "utf8"));
  if (!Array.isArray(gallery.photos)) {
    throw new Error("The travel gallery manifest must contain a photos array.");
  }

  const existingIndex = gallery.photos.findIndex((candidate) => candidate.image === photo.image);
  const existingPhoto = existingIndex >= 0 ? gallery.photos[existingIndex] : undefined;
  const nextDisplayOrder =
    gallery.photos.reduce((highest, candidate) => Math.max(highest, candidate.displayOrder ?? 0), 0) +
    10;
  const nextPhoto = {
    ...existingPhoto,
    ...photo,
    displayOrder: existingPhoto?.displayOrder ?? nextDisplayOrder
  };

  if (existingIndex >= 0) {
    gallery.photos[existingIndex] = nextPhoto;
  } else {
    gallery.photos.push(nextPhoto);
  }

  const temporaryPath = `${galleryPath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(gallery, null, 2)}\n`);
  await rename(temporaryPath, galleryPath);
}

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
  const [inputPath, requestedFilename, alt] = process.argv.slice(2);

  if (!inputPath || !requestedFilename || !alt) {
    throw new Error(
      'Usage: npm run travel:photo -- <source-image> <output-filename.webp> "Alt text"'
    );
  }

  if (basename(requestedFilename) !== requestedFilename) {
    throw new Error("The output filename must not contain a directory path.");
  }

  const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
  const outputPath = join(repositoryRoot, "src", "assets", "travel", requestedFilename);
  const galleryPath = join(repositoryRoot, "src", "content", "travel", "gallery.json");
  const cachePath = join(repositoryRoot, ".astro", "travel-geocode-cache.json");
  const metadata =
    (await parseImageMetadata(inputPath, {
      exif: true,
      gps: true,
      iptc: true,
      mergeOutput: true,
      xmp: true
    })) ?? {};
  const location = await resolvePhotoLocation(metadata, (coordinates) =>
    reverseGeocodeWithCache(coordinates, cachePath)
  );
  const locationLabel =
    [location.city, location.country].filter(Boolean).join(", ") || "Location not recorded";

  await sanitizeTravelImage(inputPath, outputPath);
  await addPhotoToGallery(galleryPath, {
    image: `../../assets/travel/${requestedFilename}`,
    alt,
    location: locationLabel,
    ...(location.city && { city: location.city }),
    ...(location.country && { country: location.country }),
    locationSource: location.source
  });
  process.stdout.write(
    `Sanitized travel image written to ${outputPath}\nGallery location: ${locationLabel}\n`
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
