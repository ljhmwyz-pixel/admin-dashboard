import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

let configured = false;

export async function ensureGoogleMaps() {
  if (!configured) {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!key) {
      throw new Error('缺少 VITE_GOOGLE_MAPS_API_KEY');
    }

    setOptions({
      key,
      v: 'weekly',
      language: 'zh-CN',
      authReferrerPolicy: 'origin',
    });

    configured = true;
  }

  const [mapsLib, geocodingLib, placesLib] = await Promise.all([
    importLibrary('maps') as Promise<google.maps.MapsLibrary>,
    importLibrary('geocoding') as Promise<google.maps.GeocodingLibrary>,
    importLibrary('places') as Promise<google.maps.PlacesLibrary>,
  ]);

  return {
    mapsLib,
    geocodingLib,
    placesLib: placesLib as google.maps.PlacesLibrary & Record<string, any>,
  };
}
