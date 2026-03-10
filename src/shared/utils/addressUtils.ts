import type {
  BaseLocationInfo,
  GooglePlaceAddressComponent,
  LocationInfo,
} from '@/shared/types/addressPickerTypes';

function normalizeI18nLang(raw?: string) {
  if (!raw) return 'en-US';
  const value = raw.replace('_', '-');
  if (value.startsWith('zh')) return 'zh-CN';
  if (value.startsWith('de')) return 'de-DE';
  if (value.startsWith('it')) return 'it-IT';
  if (value.startsWith('ja')) return 'ja-JP';
  if (value.startsWith('en')) return 'en-US';
  return 'en-US';
}

function stripPostalCodeText(text?: string) {
  if (!text) return '';

  return text
    .replace(/[，,]?\s*邮政编码 [:：]?\s*\d{4,10}/gi, '')
    .replace(/[，,]?\s*邮编 [:：]?\s*\d{4,10}/gi, '')
    .replace(/[，,]?\s*邮便番号 [:：]?\s*〒?\s*\d{3}-?\d{4}/gi, '')
    .replace(/[\s,]*Postal Code[:：]?\s*[A-Z0-9\- ]+/gi, '')
    .replace(/[\s,]*ZIP Code[:：]?\s*[A-Z0-9\- ]+/gi, '')
    .replace(/[\s,]*ZIP[:：]?\s*[A-Z0-9\- ]+/gi, '')
    .replace(/[\s,]*Postleitzahl[:：]?\s*[A-Z0-9\- ]+/gi, '')
    .replace(/[\s,]*Codice postale[:：]?\s*[A-Z0-9\- ]+/gi, '')
    .replace(/[，,]?\s*〒\s*\d{3}-?\d{4}/gi, '')
    .replace(/\s+,/g, ',')
    .replace(/,+/g, ',')
    .replace(/^,\s*|\s*,\s*$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function buildStreetDisplay(route?: string, streetNumber?: string, rawLang?: string) {
  const lang = normalizeI18nLang(rawLang);
  const normalizedRoute = route?.trim() || '';
  const normalizedStreetNumber = streetNumber?.trim() || '';

  if (!normalizedRoute && !normalizedStreetNumber) return '';
  if (!normalizedStreetNumber) return normalizedRoute;

  const routeAlreadyContainsNumber = normalizedRoute.includes(normalizedStreetNumber);

  if (!normalizedRoute) {
    if (lang.startsWith('zh')) {
      return /号$/.test(normalizedStreetNumber)
        ? normalizedStreetNumber
        : `${normalizedStreetNumber}号`;
    }
    return normalizedStreetNumber;
  }

  if (routeAlreadyContainsNumber) {
    return normalizedRoute;
  }

  if (lang.startsWith('zh')) {
    const suffixStreetNumber = /号$/.test(normalizedStreetNumber)
      ? normalizedStreetNumber
      : `${normalizedStreetNumber}号`;
    return `${normalizedRoute}${suffixStreetNumber}`;
  }

  if (lang.startsWith('ja')) {
    return `${normalizedRoute}${normalizedStreetNumber}`;
  }

  if (lang.startsWith('de') || lang.startsWith('it')) {
    return `${normalizedRoute} ${normalizedStreetNumber}`;
  }

  return `${normalizedStreetNumber} ${normalizedRoute}`;
}

function buildDefaultDisplayAddress(loc: BaseLocationInfo, rawLang?: string) {
  const lang = normalizeI18nLang(rawLang);

  const province = loc.province?.trim();
  const city = loc.city?.trim();
  const district = loc.district?.trim();
  const street = buildStreetDisplay(loc.route, loc.streetNumber, lang);

  if (lang.startsWith('zh') || lang.startsWith('ja')) {
    return [province, city, district, street].filter(Boolean).join('');
  }

  return [street, district, city, province].filter(Boolean).join(', ');
}

export function finalizeLocation(
  base: BaseLocationInfo,
  rawLang?: string,
  formatAddress?: (location: LocationInfo) => string,
): LocationInfo {
  const draft: LocationInfo = {
    ...base,
    displayAddress: '',
  };

  const displayAddress = stripPostalCodeText(
    formatAddress?.(draft) || buildDefaultDisplayAddress(base, rawLang) || base.rawAddress,
  );

  return {
    ...draft,
    displayAddress,
  };
}

function findGeocoderComp(
  components: google.maps.GeocoderAddressComponent[] = [],
  type: string,
  short = false,
) {
  const item = components.find((c) => c.types?.includes(type));
  if (!item) return '';
  return short ? item.short_name : item.long_name;
}

function findPlaceComp(
  components: GooglePlaceAddressComponent[] = [],
  type: string,
  short = false,
) {
  const item = components.find((c) => c.types?.includes(type));
  if (!item) return '';
  return short ? item.shortText || '' : item.longText || '';
}

export function normalizeGeocoderBase(result: google.maps.GeocoderResult) {
  const comps = result.address_components ?? [];
  const location = result.geometry.location;

  return {
    rawAddress: result.formatted_address ?? '',
    lat: location.lat(),
    lng: location.lng(),
    country: findGeocoderComp(comps, 'country'),
    countryCode: findGeocoderComp(comps, 'country', true),
    province: findGeocoderComp(comps, 'administrative_area_level_1'),
    city:
      findGeocoderComp(comps, 'locality') ||
      findGeocoderComp(comps, 'postal_town') ||
      findGeocoderComp(comps, 'administrative_area_level_2'),
    district:
      findGeocoderComp(comps, 'sublocality') ||
      findGeocoderComp(comps, 'sublocality_level_1') ||
      findGeocoderComp(comps, 'administrative_area_level_3'),
    postalCode: findGeocoderComp(comps, 'postal_code'),
    route: findGeocoderComp(comps, 'route'),
    streetNumber: findGeocoderComp(comps, 'street_number'),
    placeId: result.place_id,
    raw: result,
  };
}

export function normalizePlaceBase(place: {
  formattedAddress?: string;
  addressComponents?: GooglePlaceAddressComponent[];
  location?: google.maps.LatLng | google.maps.LatLngLiteral;
  id?: string;
}) {
  const comps = place.addressComponents ?? [];
  const location = place.location;

  const lat =
    typeof (location as google.maps.LatLng | undefined)?.lat === 'function'
      ? (location as google.maps.LatLng).lat()
      : ((location as google.maps.LatLngLiteral | undefined)?.lat ?? 0);

  const lng =
    typeof (location as google.maps.LatLng | undefined)?.lng === 'function'
      ? (location as google.maps.LatLng).lng()
      : ((location as google.maps.LatLngLiteral | undefined)?.lng ?? 0);

  return {
    rawAddress: place.formattedAddress ?? '',
    lat,
    lng,
    country: findPlaceComp(comps, 'country'),
    countryCode: findPlaceComp(comps, 'country', true),
    province: findPlaceComp(comps, 'administrative_area_level_1'),
    city:
      findPlaceComp(comps, 'locality') ||
      findPlaceComp(comps, 'postal_town') ||
      findPlaceComp(comps, 'administrative_area_level_2'),
    district:
      findPlaceComp(comps, 'sublocality') ||
      findPlaceComp(comps, 'sublocality_level_1') ||
      findPlaceComp(comps, 'administrative_area_level_3'),
    postalCode: findPlaceComp(comps, 'postal_code'),
    route: findPlaceComp(comps, 'route'),
    streetNumber: findPlaceComp(comps, 'street_number'),
    placeId: place.id,
    raw: place,
  };
}

export function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('当前浏览器不支持定位'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
}

export function getCurrentI18nLang() {
  if (typeof window === 'undefined') return 'en-US';
  return localStorage.getItem('i18nextLng') || 'en-US';
}

export { stripPostalCodeText };
