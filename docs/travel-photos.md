# Travel photos

Travel photos on the About page are static, build-time content. The gallery is omitted when the collection is empty and grows automatically as records are added.

## Add a photo

1. Sanitize and copy the original into the managed asset directory:

   ```bash
   npm run travel:photo -- /path/to/original.jpg accra-coast.jpg
   ```

   The command applies the camera orientation, removes EXIF, GPS, XMP, and other embedded metadata, and writes an optimized copy to `src/assets/travel/`. The original is not modified.

2. Add an entry to the `photos` array in `src/content/travel/gallery.json`:

   ```json
   {
     "photos": [
       {
         "image": "../../assets/travel/accra-coast.jpg",
         "alt": "A precise description of the visible scene.",
         "location": "Accra, Ghana",
         "capturedAt": "2026-01-15",
         "caption": "An optional note about the moment.",
         "displayOrder": 10
       }
     ]
   }
   ```

`alt`, `location`, and `image` are required. `capturedAt`, `caption`, and `displayOrder` are optional. Lower `displayOrder` values appear first. Use a truthful date when known; omit it rather than guessing.

Run `npm run check` before committing. Astro validates every record and generates responsive image variants during the production build.
