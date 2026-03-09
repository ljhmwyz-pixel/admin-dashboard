import type { DefaultOptionType } from 'antd/es/select';

export type LocationInfo = {
  rawAddress: string;
  displayAddress: string;
  lat: number;
  lng: number;
  country?: string;
  countryCode?: string;
  province?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  route?: string;
  streetNumber?: string;
  placeId?: string;
  raw?: unknown;
};

export type FieldMap = {
  address: string;
  lat?: string;
  lng?: string;
  country?: string;
  countryCode?: string;
  province?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  route?: string;
  streetNumber?: string;
};

export type GooglePrediction = {
  text?: { text?: string };
  mainText?: { text?: string };
  secondaryText?: { text?: string };
  toPlace?: () => {
    formattedAddress?: string;
    addressComponents?: GooglePlaceAddressComponent[];
    location?: google.maps.LatLng | google.maps.LatLngLiteral;
    id?: string;
    fetchFields: (params: {
      fields: Array<'formattedAddress' | 'location' | 'addressComponents' | 'id'>;
    }) => Promise<void>;
  };
};

export type GoogleSuggestionItem = {
  placePrediction?: GooglePrediction;
};

export type GooglePlaceAddressComponent = {
  types?: string[];
  longText?: string;
  shortText?: string;
};

export type GoogleOption = DefaultOptionType & {
  rawSuggestion?: GoogleSuggestionItem;
};

export type SearchScope = 'main' | 'popup';

export type BaseLocationInfo = Omit<LocationInfo, 'displayAddress'>;
