export type LocatedTravelPhoto = {
  city?: string;
  country?: string;
};

export type TravelCityGroup<T> = {
  city: string;
  photos: T[];
};

export type TravelCountryGroup<T> = {
  country: string;
  cities: TravelCityGroup<T>[];
};

export function groupTravelPhotos<T extends LocatedTravelPhoto>(
  photos: T[]
): TravelCountryGroup<T>[] {
  const countries = new Map<string, Map<string, T[]>>();

  for (const photo of photos) {
    const country = photo.country ?? "Other travels";
    const city = photo.city ?? "Location not recorded";
    const cities = countries.get(country) ?? new Map<string, T[]>();
    const cityPhotos = cities.get(city) ?? [];
    cityPhotos.push(photo);
    cities.set(city, cityPhotos);
    countries.set(country, cities);
  }

  return [...countries.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([country, cities]) => ({
      country,
      cities: [...cities.entries()]
        .sort(([first], [second]) => first.localeCompare(second))
        .map(([city, cityPhotos]) => ({ city, photos: cityPhotos }))
    }));
}
