import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Button, Form, type FormInstance, Modal, Space, Spin, Typography } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import { debounce } from 'lodash-es';

import { FormAutoComplete } from '@/components';
import { useLanguage } from '@/shared/hooks/useLanguage';
import { ensureGoogleMaps } from '@/shared/utils/googleMaps';

type LocationInfo = {
  formattedAddress: string;
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

type FieldMap = {
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

type GooglePrediction = {
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

type GoogleSuggestionItem = {
  placePrediction?: GooglePrediction;
};

type GooglePlaceAddressComponent = {
  types?: string[];
  longText?: string;
  shortText?: string;
};

type GoogleOption = DefaultOptionType & {
  rawSuggestion?: GoogleSuggestionItem;
};

type Props = {
  form: FormInstance;
  fieldMap: FieldMap;
  placeholder?: string;
  debounceMs?: number;
  minSearchLength?: number;
  popupTitle?: string;
  onResolved?: (location: LocationInfo) => void;
  formatAddress?: (location: LocationInfo) => string;
};

type SearchScope = 'main' | 'popup';

const DEFAULT_CENTER = { lat: 31.2304, lng: 121.4737 };

function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
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
        timeout: 8000,
        maximumAge: 60000,
      },
    );
  });
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

function normalizeGeocoderResult(result: google.maps.GeocoderResult): LocationInfo {
  const comps = result.address_components ?? [];
  const location = result.geometry.location;

  return {
    formattedAddress: result.formatted_address ?? '',
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

function normalizePlace(place: {
  formattedAddress?: string;
  addressComponents?: GooglePlaceAddressComponent[];
  location?: google.maps.LatLng | google.maps.LatLngLiteral;
  id?: string;
}): LocationInfo {
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
    formattedAddress: place.formattedAddress ?? '',
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

export default function AddressPickerAutoComplete({
  form,
  fieldMap,
  placeholder = '',
  debounceMs = 500,
  minSearchLength = 3,
  popupTitle = '选择地址',
  onResolved,
  formatAddress,
}: Props) {
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);
  const [booting, setBooting] = useState(false);
  const [error, setError] = useState<string>();
  const [mainOptions, setMainOptions] = useState<GoogleOption[]>([]);
  const [popupOptions, setPopupOptions] = useState<GoogleOption[]>([]);
  const [popupValue, setPopupValue] = useState('');
  const [draftLocation, setDraftLocation] = useState<LocationInfo | null>(null);
  const [dragging, setDragging] = useState(false);
  const [resolvingCenter, setResolvingCenter] = useState(false);
  const [locating, setLocating] = useState(false);

  const addressValue = Form.useWatch(fieldMap.address, form) ?? '';

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const idleListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const clickListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const dragStartListenerRef = useRef<google.maps.MapsEventListener | null>(null);

  const mainTokenRef = useRef<unknown>(null);
  const popupTokenRef = useRef<unknown>(null);
  const mainSuggestSeqRef = useRef(0);
  const popupSuggestSeqRef = useRef(0);
  const geocodeSeqRef = useRef(0);
  const reverseSeqRef = useRef(0);
  const skipNextIdleReverseRef = useRef(false);

  const clearDerivedFields = useCallback(() => {
    const patch: Record<string, unknown> = {};

    if (fieldMap.lat) patch[fieldMap.lat] = undefined;
    if (fieldMap.lng) patch[fieldMap.lng] = undefined;
    if (fieldMap.country) patch[fieldMap.country] = undefined;
    if (fieldMap.countryCode) patch[fieldMap.countryCode] = undefined;
    if (fieldMap.province) patch[fieldMap.province] = undefined;
    if (fieldMap.city) patch[fieldMap.city] = undefined;
    if (fieldMap.district) patch[fieldMap.district] = undefined;
    if (fieldMap.postalCode) patch[fieldMap.postalCode] = undefined;
    if (fieldMap.route) patch[fieldMap.route] = undefined;
    if (fieldMap.streetNumber) patch[fieldMap.streetNumber] = undefined;

    form.setFieldsValue(patch);
    setDraftLocation(null);
    setError(undefined);
  }, [fieldMap, form]);

  const writeLocationToForm = useCallback(
    (loc: LocationInfo, options?: { writeAddress?: boolean }) => {
      const shouldWriteAddress = options?.writeAddress ?? false;
      const patch: Record<string, unknown> = {};

      if (shouldWriteAddress) {
        patch[fieldMap.address] = formatAddress ? formatAddress(loc) : loc.formattedAddress;
      }
      if (fieldMap.lat) patch[fieldMap.lat] = loc.lat;
      if (fieldMap.lng) patch[fieldMap.lng] = loc.lng;
      if (fieldMap.country) patch[fieldMap.country] = loc.country;
      if (fieldMap.countryCode) patch[fieldMap.countryCode] = loc.countryCode;
      if (fieldMap.province) patch[fieldMap.province] = loc.province;
      if (fieldMap.city) patch[fieldMap.city] = loc.city;
      if (fieldMap.district) patch[fieldMap.district] = loc.district;
      if (fieldMap.postalCode) patch[fieldMap.postalCode] = loc.postalCode;
      if (fieldMap.route) patch[fieldMap.route] = loc.route;
      if (fieldMap.streetNumber) patch[fieldMap.streetNumber] = loc.streetNumber;

      form.setFieldsValue(patch);
      setError(undefined);

      if (shouldWriteAddress) {
        void form.validateFields([fieldMap.address]);
      }

      onResolved?.(loc);
    },
    [fieldMap, form, formatAddress, onResolved],
  );

  const getGeocoder = useCallback(async () => {
    if (geocoderRef.current) return geocoderRef.current;
    const { geocodingLib } = await ensureGoogleMaps();
    geocoderRef.current = new geocodingLib.Geocoder();
    return geocoderRef.current;
  }, []);

  const getSessionToken = useCallback(async (scope: SearchScope) => {
    const { placesLib } = await ensureGoogleMaps();
    const TokenCtor = (placesLib as { AutocompleteSessionToken?: new () => unknown })
      .AutocompleteSessionToken;

    if (!TokenCtor) {
      throw new Error('AutocompleteSessionToken 不可用，请确认 Places API (New) 已启用');
    }

    if (scope === 'main') {
      if (!mainTokenRef.current) {
        mainTokenRef.current = new TokenCtor();
      }
      return mainTokenRef.current;
    }

    if (!popupTokenRef.current) {
      popupTokenRef.current = new TokenCtor();
    }
    return popupTokenRef.current;
  }, []);

  const resetSessionToken = useCallback((scope: SearchScope) => {
    if (scope === 'main') {
      mainTokenRef.current = null;
      return;
    }

    popupTokenRef.current = null;
  }, []);

  const setOptionsByScope = useCallback((scope: SearchScope, options: GoogleOption[]) => {
    if (scope === 'main') {
      setMainOptions(options);
    } else {
      setPopupOptions(options);
    }
  }, []);

  const moveMapTo = useCallback((lat: number, lng: number, zoom = 17) => {
    if (!mapRef.current) return;
    skipNextIdleReverseRef.current = true;
    mapRef.current.setCenter({ lat, lng });
    mapRef.current.setZoom(zoom);
  }, []);

  const reverseGeocode = useCallback(
    async (
      lat: number,
      lng: number,
      options?: { syncAddress?: boolean; syncPopupText?: boolean },
    ) => {
      const seq = ++reverseSeqRef.current;
      setResolvingCenter(true);

      try {
        const geocoder = await getGeocoder();
        const { results } = await geocoder.geocode({ location: { lat, lng } });
        if (seq !== reverseSeqRef.current || !results?.length) return null;

        const loc = normalizeGeocoderResult(results[0]);
        setDraftLocation(loc);

        if (options?.syncPopupText !== false) {
          setPopupValue(loc.formattedAddress);
        }

        writeLocationToForm(loc, { writeAddress: options?.syncAddress ?? false });
        return loc;
      } finally {
        if (seq === reverseSeqRef.current) {
          setResolvingCenter(false);
        }
      }
    },
    [getGeocoder, writeLocationToForm],
  );

  const geocodeText = useCallback(
    async (
      text: string,
      options?: {
        syncMap?: boolean;
        syncPopupText?: boolean;
        writeAddress?: boolean;
      },
    ) => {
      const keyword = text.trim();
      if (!keyword || keyword.length < minSearchLength) return null;

      const seq = ++geocodeSeqRef.current;
      const geocoder = await getGeocoder();
      const { results } = await geocoder.geocode({ address: keyword });

      if (seq !== geocodeSeqRef.current || !results?.length) return null;

      const loc = normalizeGeocoderResult(results[0]);
      setDraftLocation(loc);
      writeLocationToForm(loc, { writeAddress: options?.writeAddress });

      if (options?.syncPopupText) {
        setPopupValue(loc.formattedAddress);
      }

      if (options?.syncMap) {
        moveMapTo(loc.lat, loc.lng);
      }

      return loc;
    },
    [getGeocoder, minSearchLength, moveMapTo, writeLocationToForm],
  );

  const fetchSuggestions = useCallback(
    async (keyword: string, scope: SearchScope) => {
      const text = keyword.trim();
      if (text.length < 2) {
        setOptionsByScope(scope, []);
        return;
      }

      const seqRef = scope === 'main' ? mainSuggestSeqRef : popupSuggestSeqRef;
      const currentSeq = ++seqRef.current;

      try {
        const { placesLib } = await ensureGoogleMaps();
        const AutocompleteSuggestion = (
          placesLib as unknown as {
            AutocompleteSuggestion?: {
              fetchAutocompleteSuggestions?: (params: {
                input: string;
                sessionToken: unknown;
              }) => Promise<{ suggestions?: GoogleSuggestionItem[] }>;
            };
          }
        ).AutocompleteSuggestion;

        if (!AutocompleteSuggestion?.fetchAutocompleteSuggestions) {
          throw new Error('AutocompleteSuggestion 不可用');
        }

        const sessionToken = await getSessionToken(scope);
        const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: text,
          sessionToken,
        });

        if (currentSeq !== seqRef.current) return;

        const nextOptions: GoogleOption[] = (suggestions || [])
          .filter((item) => item?.placePrediction)
          .map((item) => {
            const prediction = item.placePrediction;
            const mainText = prediction?.mainText?.text || prediction?.text?.text || '';
            const secondaryText = prediction?.secondaryText?.text || '';

            return {
              value: prediction?.text?.text || mainText,
              label: secondaryText ? `${mainText} (${secondaryText})` : mainText,
              rawSuggestion: item,
            };
          });

        setOptionsByScope(scope, nextOptions);
      } catch (fetchError) {
        console.error('fetchSuggestions failed:', fetchError);
        setOptionsByScope(scope, []);
      }
    },
    [getSessionToken, setOptionsByScope],
  );

  const debouncedFetchSuggestions = useMemo(
    () =>
      debounce((keyword: string, scope: SearchScope) => {
        void fetchSuggestions(keyword, scope);
      }, debounceMs),
    [fetchSuggestions, debounceMs],
  );

  const debouncedReverseGeocode = useMemo(
    () =>
      debounce((lat: number, lng: number) => {
        void reverseGeocode(lat, lng, { syncPopupText: true, syncAddress: true });
      }, 250),
    [reverseGeocode],
  );

  useEffect(() => {
    return () => {
      debouncedFetchSuggestions.cancel();
      debouncedReverseGeocode.cancel();
      idleListenerRef.current?.remove();
      clickListenerRef.current?.remove();
      dragStartListenerRef.current?.remove();
    };
  }, [debouncedFetchSuggestions, debouncedReverseGeocode]);

  const resolveSuggestion = useCallback(
    async (option: GoogleOption, scope: SearchScope) => {
      try {
        const prediction = option.rawSuggestion?.placePrediction;
        if (!prediction?.toPlace) return;

        const place = prediction.toPlace();
        await place.fetchFields({
          fields: ['formattedAddress', 'location', 'addressComponents', 'id'],
        });

        const loc = normalizePlace(place);
        setDraftLocation(loc);

        if (scope === 'main') {
          writeLocationToForm(loc, { writeAddress: true });
          setMainOptions([]);
        } else {
          setPopupValue(loc.formattedAddress);
          writeLocationToForm(loc, { writeAddress: true });
          moveMapTo(loc.lat, loc.lng);
          setPopupOptions([]);
        }

        resetSessionToken(scope);
      } catch (resolveError) {
        console.error('resolveSuggestion failed:', resolveError);
      }
    },
    [moveMapTo, resetSessionToken, writeLocationToForm],
  );

  const resolveCurrentCenter = useCallback(async () => {
    const center = mapRef.current?.getCenter();
    if (!center) return null;
    return reverseGeocode(center.lat(), center.lng(), { syncPopupText: true, syncAddress: true });
  }, [reverseGeocode]);

  const locateCurrentPosition = useCallback(
    async (options?: { syncAddress?: boolean }) => {
      setLocating(true);

      try {
        const pos = await getCurrentPosition();

        if (mapRef.current) {
          skipNextIdleReverseRef.current = true;
          mapRef.current.setCenter(pos);
          mapRef.current.setZoom(16);
        }

        return await reverseGeocode(pos.lat, pos.lng, {
          syncPopupText: true,
          syncAddress: options?.syncAddress ?? true,
        });
      } catch (locateError) {
        console.error('locateCurrentPosition failed:', locateError);
        setError('无法获取当前位置，请检查浏览器定位权限');
        return null;
      } finally {
        setLocating(false);
      }
    },
    [reverseGeocode],
  );

  const initOrRefreshMap = useCallback(
    async (options?: { preferCurrentLocation?: boolean }) => {
      if (!mapContainerRef.current) return;

      setBooting(true);

      try {
        const { mapsLib } = await ensureGoogleMaps();
        const MapClass = mapsLib.Map;

        const currentLat = Number(fieldMap.lat ? form.getFieldValue(fieldMap.lat) : undefined);
        const currentLng = Number(fieldMap.lng ? form.getFieldValue(fieldMap.lng) : undefined);
        const hasCurrentPoint = Number.isFinite(currentLat) && Number.isFinite(currentLng);

        let center = draftLocation
          ? { lat: draftLocation.lat, lng: draftLocation.lng }
          : hasCurrentPoint
            ? { lat: currentLat, lng: currentLng }
            : DEFAULT_CENTER;

        if (!draftLocation && !hasCurrentPoint && options?.preferCurrentLocation) {
          try {
            center = await getCurrentPosition();
          } catch (locateError) {
            console.warn('getCurrentPosition failed, fallback to default center:', locateError);
          }
        }

        const zoom = draftLocation || hasCurrentPoint || options?.preferCurrentLocation ? 16 : 12;

        if (!mapRef.current) {
          mapRef.current = new MapClass(mapContainerRef.current, {
            center,
            zoom,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy',
          });

          clickListenerRef.current?.remove();
          idleListenerRef.current?.remove();
          dragStartListenerRef.current?.remove();

          dragStartListenerRef.current = mapRef.current.addListener('dragstart', () => {
            setDragging(true);
          });

          clickListenerRef.current = mapRef.current.addListener(
            'click',
            (e: google.maps.MapMouseEvent) => {
              if (!e.latLng || !mapRef.current) return;
              setDragging(true);
              mapRef.current.panTo(e.latLng);
            },
          );

          idleListenerRef.current = mapRef.current.addListener('idle', () => {
            setDragging(false);

            if (skipNextIdleReverseRef.current) {
              skipNextIdleReverseRef.current = false;
              return;
            }

            const mapCenter = mapRef.current?.getCenter();
            if (!mapCenter) return;

            debouncedReverseGeocode(mapCenter.lat(), mapCenter.lng());
          });
        } else {
          skipNextIdleReverseRef.current = true;
          mapRef.current.setCenter(center);
          mapRef.current.setZoom(zoom);
        }

        if (!hasCurrentPoint && options?.preferCurrentLocation) {
          await reverseGeocode(center.lat, center.lng, { syncPopupText: true, syncAddress: true });
        }
      } finally {
        setBooting(false);
      }
    },
    [debouncedReverseGeocode, draftLocation, fieldMap.lat, fieldMap.lng, form, reverseGeocode],
  );

  const validateAddressField = useCallback(() => {
    void form.validateFields([fieldMap.address]);
  }, [fieldMap.address, form]);

  const handleMainSearch = useCallback(
    (value: string) => {
      debouncedFetchSuggestions(value, 'main');
      form.setFields([{ name: fieldMap.address, errors: [] }]);
    },
    [debouncedFetchSuggestions, fieldMap.address, form],
  );

  const handleMainChange = useCallback(
    (value: string) => {
      form.setFieldValue(fieldMap.address, value || undefined);

      if (!value) {
        setMainOptions([]);
        clearDerivedFields();
        resetSessionToken('main');
      }
    },
    [clearDerivedFields, fieldMap.address, form, resetSessionToken],
  );

  const handleMainBlur = useCallback(async () => {
    validateAddressField();

    const text = String(form.getFieldValue(fieldMap.address) ?? '').trim();
    if (text.length < minSearchLength) return;
    if (draftLocation?.formattedAddress === text) return;

    await geocodeText(text, { writeAddress: true });
  }, [
    draftLocation?.formattedAddress,
    fieldMap.address,
    form,
    geocodeText,
    minSearchLength,
    validateAddressField,
  ]);

  const handlePopupSearch = useCallback(
    (value: string) => {
      debouncedFetchSuggestions(value, 'popup');
    },
    [debouncedFetchSuggestions],
  );

  const handlePopupChange = useCallback(
    (value: string) => {
      setPopupValue(value);
      if (!value) {
        setPopupOptions([]);
        resetSessionToken('popup');
      }
    },
    [resetSessionToken],
  );

  const handlePopupBlur = useCallback(async () => {
    const text = popupValue.trim();
    if (text.length < minSearchLength) return;
    if (draftLocation?.formattedAddress === text) return;

    await geocodeText(text, {
      syncMap: true,
      syncPopupText: true,
      writeAddress: true,
    });
  }, [draftLocation?.formattedAddress, geocodeText, minSearchLength, popupValue]);

  const handleOpenModal = useCallback(() => {
    setPopupValue(String(form.getFieldValue(fieldMap.address) ?? ''));
    setOpen(true);
  }, [fieldMap.address, form]);

  const handleAfterOpenChange = useCallback(
    (visible: boolean) => {
      if (!visible) return;
      requestAnimationFrame(() => {
        void initOrRefreshMap({ preferCurrentLocation: true });
      });
    },
    [initOrRefreshMap],
  );

  return (
    <>
      <FormAutoComplete
        label={t('org.field.address')}
        prefixIcon={
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.49963 6.99997H3.49951C2.39494 6.99997 1.49951 7.8954 1.49951 8.99997V13.4H5.49963M7.99963 4.49997H10.4995M0.599609 13.4H13.3995M12.4995 13.4V2.59998C12.4995 1.49541 11.6041 0.599976 10.4995 0.599976H7.99963C6.89506 0.599976 5.99963 1.49541 5.99963 2.59998V13.4H12.4995Z"
              stroke="#191B1F"
              strokeOpacity="0.6"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        }
        required
        name={fieldMap.address}
        rules={[
          {
            required: true,
            message: placeholder,
          },
        ]}
        autoCompleteProps={{
          value: addressValue,
          options: mainOptions,
          status: error ? 'error' : undefined,
          onBlur: handleMainBlur,
          optionRender: (option) => {
            const data = option.data as GoogleOption;
            const labelText = typeof data.label === 'string' ? data.label : '';
            const mainText = labelText.split(' (')[0] || '';
            const secondaryText = labelText.match(/\((.*)\)/)?.[1] || '';

            return (
              <div style={{ lineHeight: 1.4 }}>
                <div>{mainText}</div>
                {secondaryText ? (
                  <div style={{ fontSize: 12, color: '#999' }}>{secondaryText}</div>
                ) : null}
              </div>
            );
          },
          onSearch: handleMainSearch,
          onChange: handleMainChange,
          onSelect: (_, option) => {
            void resolveSuggestion(option as GoogleOption, 'main');
          },
          suffix: (
            <span style={{ cursor: 'pointer' }} onClick={handleOpenModal}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.99951 9.33945C1.12347 9.76716 0.599609 10.3097 0.599609 10.9001C0.599609 12.2808 3.46499 13.4001 6.99961 13.4001C10.5342 13.4001 13.3996 12.2808 13.3996 10.9001C13.3996 10.3097 12.8757 9.76708 11.9995 9.33936"
                  stroke="#33C2C8"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M11 4.59998C11 6.80911 7 11 7 11C7 11 3 6.80911 3 4.59998C3 2.39084 4.79086 0.599976 7 0.599976C9.20914 0.599976 11 2.39084 11 4.59998Z"
                  stroke="#191B1F"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M7.39961 4.4C7.39961 4.62091 7.22052 4.8 6.99961 4.8C6.7787 4.8 6.59961 4.62091 6.59961 4.4C6.59961 4.17909 6.7787 4 6.99961 4C7.22052 4 7.39961 4.17909 7.39961 4.4Z"
                  stroke="#191B1F"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          ),
          placeholder,
        }}
      />

      <Modal
        title={popupTitle}
        open={open}
        onCancel={() => setOpen(false)}
        afterOpenChange={handleAfterOpenChange}
        width={920}
        destroyOnClose={false}
        footer={
          <Space>
            <Button onClick={() => setOpen(false)}>取消</Button>
            <Button onClick={() => void locateCurrentPosition()} loading={locating}>
              定位到当前位置
            </Button>
            <Button onClick={() => void resolveCurrentCenter()} loading={resolvingCenter}>
              取地图中心点
            </Button>
            <Button
              type="primary"
              loading={resolvingCenter || locating}
              onClick={async () => {
                const loc = draftLocation ?? (await resolveCurrentCenter());
                if (!loc) return;
                writeLocationToForm(loc, { writeAddress: true });
                setOpen(false);
              }}
            >
              确认此位置
            </Button>
          </Space>
        }
      >
        <Spin spinning={booting}>
          <div style={{ marginBottom: 12 }}>
            <FormAutoComplete
              autoCompleteProps={{
                placeholder: '搜索地址或地标',
                value: popupValue,
                options: popupOptions,
                allowClear: true,
                onSearch: handlePopupSearch,
                onChange: handlePopupChange,
                onBlur: handlePopupBlur,
                onSelect: (_, option) => {
                  void resolveSuggestion(option as GoogleOption, 'popup');
                },
              }}
            />
          </div>

          <Alert
            style={{ marginBottom: 12 }}
            type="info"
            showIcon
            message={
              dragging
                ? '拖拽中，松手后会自动回填当前位置。'
                : '拖动地图，使中心图钉对准目标位置；停止后会自动回填，也可手动点击“取地图中心点”。'
            }
          />

          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 500,
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              overflow: 'hidden',
              background: '#f7f7f7',
            }}
          >
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: dragging
                  ? 'translate(-50%, -105%) scale(1.08)'
                  : 'translate(-50%, -100%)',
                pointerEvents: 'none',
                fontSize: 34,
                lineHeight: 1,
                transition: 'transform 120ms ease',
              }}
            >
              📍
            </div>

            {resolvingCenter || locating ? (
              <div
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 12,
                  background: 'rgba(255,255,255,0.92)',
                  padding: '6px 10px',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#595959',
                }}
              >
                正在解析中心点...
              </div>
            ) : null}
          </div>
        </Spin>
      </Modal>
    </>
  );
}
