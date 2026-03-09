import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash-es';

import { ensureGoogleMaps } from '@/shared/utils/googleMaps';

import type {
  FieldMap,
  GoogleOption,
  GooglePlaceAddressComponent,
  GoogleSuggestionItem,
  LocationInfo,
  SearchScope,
} from '../types/addressPickerTypes';
import {
  finalizeLocation,
  getCurrentI18nLang,
  getCurrentPosition,
  normalizeGeocoderBase,
  normalizePlaceBase,
} from '../utils/addressUtils';

type UseAddressPickerMapOptions = {
  fieldMap: FieldMap;
  form: any;
  minSearchLength: number;
  onResolved?: (location: LocationInfo) => void;
  formatAddress?: (location: LocationInfo) => string;
};

export function useAddressPickerMap({
  fieldMap,
  form,
  minSearchLength,
  onResolved,
  formatAddress,
}: UseAddressPickerMapOptions) {
  const langRef = useRef(getCurrentI18nLang());
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

  const [booting, setBooting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [resolvingCenter, setResolvingCenter] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string>();
  const [mainOptions, setMainOptions] = useState<GoogleOption[]>([]);
  const [popupOptions, setPopupOptions] = useState<GoogleOption[]>([]);
  const [draftLocation, setDraftLocation] = useState<LocationInfo | null>(null);

  useEffect(() => {
    langRef.current = getCurrentI18nLang();
  }, []);

  const makeLocationFromGeocoder = useCallback(
    (result: google.maps.GeocoderResult) =>
      finalizeLocation(normalizeGeocoderBase(result), langRef.current, formatAddress),
    [formatAddress],
  );

  const makeLocationFromPlace = useCallback(
    (place: {
      formattedAddress?: string;
      addressComponents?: GooglePlaceAddressComponent[];
      location?: google.maps.LatLng | google.maps.LatLngLiteral;
      id?: string;
    }) => finalizeLocation(normalizePlaceBase(place), langRef.current, formatAddress),
    [formatAddress],
  );

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
    (loc: LocationInfo, options?: { writeAddress?: boolean; syncPopupText?: boolean }) => {
      const shouldWriteAddress = options?.writeAddress ?? false;
      const patch: Record<string, unknown> = {};

      if (shouldWriteAddress) {
        patch[fieldMap.address] = loc.displayAddress;
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
      setDraftLocation(loc);
      setError(undefined);

      if (shouldWriteAddress) {
        void form.validateFields([fieldMap.address]);
      }

      onResolved?.(loc);
    },
    [fieldMap, form, onResolved],
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
      if (!mainTokenRef.current) mainTokenRef.current = new TokenCtor();
      return mainTokenRef.current;
    }

    if (!popupTokenRef.current) popupTokenRef.current = new TokenCtor();
    return popupTokenRef.current;
  }, []);

  const resetSessionToken = useCallback((scope: SearchScope) => {
    if (scope === 'main') {
      mainTokenRef.current = null;
      return;
    }
    popupTokenRef.current = null;
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

        const loc = makeLocationFromGeocoder(results[0]);
        writeLocationToForm(loc, {
          writeAddress: options?.syncAddress ?? false,
          syncPopupText: options?.syncPopupText ?? true,
        });
        return loc;
      } finally {
        if (seq === reverseSeqRef.current) setResolvingCenter(false);
      }
    },
    [getGeocoder, makeLocationFromGeocoder, writeLocationToForm],
  );

  const geocodeText = useCallback(
    async (
      text: string,
      options?: { syncMap?: boolean; syncPopupText?: boolean; writeAddress?: boolean },
    ) => {
      const keyword = text.trim();
      if (!keyword || keyword.length < minSearchLength) return null;

      const seq = ++geocodeSeqRef.current;
      const geocoder = await getGeocoder();
      const { results } = await geocoder.geocode({ address: keyword });

      if (seq !== geocodeSeqRef.current || !results?.length) return null;

      const loc = makeLocationFromGeocoder(results[0]);

      writeLocationToForm(loc, {
        writeAddress: options?.writeAddress ?? false,
        syncPopupText: options?.syncPopupText ?? false,
      });

      if (options?.syncMap) {
        moveMapTo(loc.lat, loc.lng);
      }

      return loc;
    },
    [getGeocoder, makeLocationFromGeocoder, minSearchLength, moveMapTo, writeLocationToForm],
  );

  const setOptionsByScope = useCallback((scope: SearchScope, options: GoogleOption[]) => {
    if (scope === 'main') setMainOptions(options);
    else setPopupOptions(options);
  }, []);

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
      debounce((keyword: string, scope: SearchScope) => void fetchSuggestions(keyword, scope), 500),
    [fetchSuggestions],
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

        const loc = makeLocationFromPlace(place);

        if (scope === 'main') {
          writeLocationToForm(loc, { writeAddress: true, syncPopupText: false });
          setMainOptions([]);
          resetSessionToken('main');
        } else {
          writeLocationToForm(loc, { writeAddress: false, syncPopupText: true });
          moveMapTo(loc.lat, loc.lng);
          setPopupOptions([]);
          resetSessionToken('popup');
        }
      } catch (resolveError) {
        console.error('resolveSuggestion failed:', resolveError);
      }
    },
    [makeLocationFromPlace, moveMapTo, resetSessionToken, writeLocationToForm],
  );

  const resolveCurrentCenter = useCallback(async () => {
    const center = mapRef.current?.getCenter();
    if (!center) return null;
    return reverseGeocode(center.lat(), center.lng(), {
      syncPopupText: true,
      syncAddress: true,
    });
  }, [reverseGeocode]);

  const locateCurrentPosition = useCallback(async () => {
    setLocating(true);
    try {
      const current = await getCurrentPosition();
      moveMapTo(current.lat, current.lng, 17);
      await reverseGeocode(current.lat, current.lng, {
        syncPopupText: true,
        syncAddress: true,
      });
    } catch (locateError) {
      console.error('locateCurrentPosition failed:', locateError);
      setError('无法获取当前位置，请检查浏览器定位权限。');
    } finally {
      setLocating(false);
    }
  }, [moveMapTo, reverseGeocode]);

  const initOrRefreshMap = useCallback(
    async (options?: { preferCurrentLocation?: boolean }) => {
      if (!mapContainerRef.current) return;
      setBooting(true);
      setError(undefined);

      try {
        const { mapsLib } = await ensureGoogleMaps();

        const formLat = form.getFieldValue(fieldMap.lat);
        const formLng = form.getFieldValue(fieldMap.lng);
        const hasCurrentPoint = Number.isFinite(formLat) && Number.isFinite(formLng);

        let center = hasCurrentPoint
          ? { lat: Number(formLat), lng: Number(formLng) }
          : draftLocation
            ? { lat: draftLocation.lat, lng: draftLocation.lng }
            : { lat: 31.2304, lng: 121.4737 };

        if (!hasCurrentPoint && options?.preferCurrentLocation) {
          try {
            center = await getCurrentPosition();
          } catch (locateError) {
            console.warn('getCurrentPosition failed, fallback to default center', locateError);
          }
        }

        const zoom = hasCurrentPoint || draftLocation ? 17 : 13;

        if (!mapRef.current) {
          mapRef.current = new mapsLib.Map(mapContainerRef.current, {
            center,
            zoom,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            clickableIcons: false,
            gestureHandling: 'greedy',
          });

          clickListenerRef.current?.remove();
          clickListenerRef.current = mapRef.current.addListener(
            'click',
            (event: google.maps.MapMouseEvent) => {
              const latLng = event.latLng;
              if (!latLng || !mapRef.current) return;

              skipNextIdleReverseRef.current = true;
              mapRef.current.panTo(latLng);
              void reverseGeocode(latLng.lat(), latLng.lng(), {
                syncPopupText: true,
                syncAddress: true,
              });
            },
          );

          dragStartListenerRef.current?.remove();
          dragStartListenerRef.current = mapRef.current.addListener('dragstart', () => {
            setDragging(true);
          });

          idleListenerRef.current?.remove();
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

  return {
    booting,
    dragging,
    resolvingCenter,
    locating,
    error,
    mainOptions,
    popupOptions,
    draftLocation,
    mapContainerRef,
    setError,
    setDraftLocation,
    setMainOptions,
    setPopupOptions,
    clearDerivedFields,
    writeLocationToForm,
    debouncedFetchSuggestions,
    debouncedReverseGeocode,
    fetchSuggestions,
    geocodeText,
    resolveSuggestion,
    resolveCurrentCenter,
    locateCurrentPosition,
    initOrRefreshMap,
    resetSessionToken,
  };
}
