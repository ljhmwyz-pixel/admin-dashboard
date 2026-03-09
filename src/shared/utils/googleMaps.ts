import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

let configured = false;
let configuredLocale = '';

const GOOGLE_MAPS_LOCALE_MAP = {
  'zh-CN': { language: 'zh-CN', region: 'CN' },
  'en-US': { language: 'en', region: 'US' },
  'de-DE': { language: 'de', region: 'DE' },
  'it-IT': { language: 'it', region: 'IT' },
  'ja-JP': { language: 'ja', region: 'JP' },
} as const;

function getGoogleMapsLocale(rawLang?: string) {
  return (
    GOOGLE_MAPS_LOCALE_MAP[(rawLang || 'en-US') as keyof typeof GOOGLE_MAPS_LOCALE_MAP] ??
    GOOGLE_MAPS_LOCALE_MAP['en-US']
  );
}

function getCurrentI18nLanguage() {
  return localStorage.getItem('i18nextLng') || 'en-US';
}

export async function ensureGoogleMaps() {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!key) {
    throw new Error('缺少 VITE_GOOGLE_MAPS_API_KEY');
  }

  const currentLang = getCurrentI18nLanguage();
  const { language, region } = getGoogleMapsLocale(currentLang);

  if (!configured) {
    setOptions({
      key,
      v: 'weekly',
      language,
      region,
      authReferrerPolicy: 'origin',
    });

    configured = true;
    configuredLocale = `${language}-${region}`;
  } else {
    const nextLocale = `${language}-${region}`;

    if (configuredLocale !== nextLocale) {
      console.warn(
        `[Google Maps] 已按 ${configuredLocale} 初始化，当前请求语言为 ${nextLocale}。` +
          `Maps JS API 已加载后不会自动切换语言，如需切换请刷新页面。`,
      );
    }
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
