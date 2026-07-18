# Travel photos

Travel photos on the About page are static, build-time content. The gallery is omitted when the collection is empty and grows automatically as records are added.

## Add a photo

1. Sanitize and copy the original into the managed asset directory:

   ```bash
   npm run travel:photo -- /path/to/original.jpg accra-coast.webp "Fishing boats drawn up on a beach."
   ```

   The command reads location data first, applies the camera orientation, converts the image to WebP at a balanced quality setting of 82, limits its longest edge to 2560 pixels without upscaling, removes EXIF, GPS, XMP, and other embedded metadata, and writes an optimized copy to `src/assets/travel/`. The original is not modified.

2. Review the new entry that the command adds to `src/content/travel/gallery.json`. Add an optional caption if useful.

   ```json
   {
     "photos": [
       {
         "image": "../../assets/travel/accra-coast.webp",
         "alt": "A precise description of the visible scene.",
         "location": "Accra, Ghana",
         "city": "Accra",
         "country": "Ghana",
         "locationSource": "openstreetmap",
         "caption": "An optional note about the moment.",
         "displayOrder": 10
       }
     ]
   }
   ```

The gallery groups photos by `country` and then `city`. When city and country are embedded directly, the importer uses them without a network request. When only GPS coordinates exist, it sends those coordinates to the configured Nominatim reverse-geocoding endpoint, stores only the returned city and country, and removes the precise coordinates from the published image. Results are cached locally under `.astro/`, requests are limited to one per second, and OpenStreetMap attribution appears with galleries that use derived locations.

Set `TRAVEL_GEOCODER_URL` to use another compatible endpoint. Set `TRAVEL_GEOCODER_USER_AGENT` when the endpoint requires different application identification. Public Nominatim usage is subject to its [usage policy](https://operations.osmfoundation.org/policies/nominatim/).

`alt`, `location`, and `image` are required. `city`, `country`, `capturedAt`, `caption`, and `displayOrder` are optional. Lower `displayOrder` values appear first. Use a truthful date when known; omit it rather than guessing.

Run `npm run check` before committing. Astro validates every record and generates responsive image variants during the production build.
