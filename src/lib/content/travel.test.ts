import { describe, expect, it } from "vitest";
import { groupTravelPhotos } from "./travel";

describe("groupTravelPhotos", () => {
  it("groups photos by country and then city", () => {
    const groups = groupTravelPhotos([
      { id: "accra", country: "Ghana", city: "Accra" },
      { id: "dakar", country: "Senegal", city: "Dakar" },
      { id: "cape-coast", country: "Ghana", city: "Cape Coast" }
    ]);

    expect(groups).toEqual([
      {
        country: "Ghana",
        cities: [
          { city: "Accra", photos: [{ id: "accra", country: "Ghana", city: "Accra" }] },
          {
            city: "Cape Coast",
            photos: [{ id: "cape-coast", country: "Ghana", city: "Cape Coast" }]
          }
        ]
      },
      {
        country: "Senegal",
        cities: [
          { city: "Dakar", photos: [{ id: "dakar", country: "Senegal", city: "Dakar" }] }
        ]
      }
    ]);
  });
});
