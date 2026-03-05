import { useCallback, useEffect, useRef, useState } from 'react';
import { AutoComplete, Button, type FormInstance, Input, Modal, Space, Spin } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';

import { ensureGoogleMaps } from '@/shared/types/googleMaps';

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
  address?: string;
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

type GoogleOption = DefaultOptionType & {
  rawSuggestion?: any;
};

type Props = {
  form: FormInstance;
  fieldMap: FieldMap;
  placeholder?: string;
  debounceMs?: number;
  minSearchLength?: number;
  popupTitle?: string;
  onResolved?: (location: LocationInfo) => void;
  formatAddress?: (location: LocationInfo) => string; // 自定义格式化地址
};

function findGeocoderComp(
  components: google.maps.GeocoderAddressComponent[] = [],
  type: string,
  short = false,
) {
  const item = components.find((c) => c.types?.includes(type));
  if (!item) return '';
  return short ? item.short_name : item.long_name;
}

function findPlaceComp(components: any[] = [], type: string, short = false) {
  const item = components.find((c) => c.types?.includes(type));
  if (!item) return '';
  return short ? item.shortText : item.longText;
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

function normalizePlace(place: any): LocationInfo {
  const comps = place.addressComponents ?? [];
  const location = place.location;

  return {
    formattedAddress: place.formattedAddress ?? '',
    lat: typeof location?.lat === 'function' ? location.lat() : (location?.lat ?? 0),
    lng: typeof location?.lng === 'function' ? location.lng() : (location?.lng ?? 0),
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
  placeholder = '请输入地址',
  debounceMs = 500,
  minSearchLength = 3,
  popupTitle = '选择地址',
  onResolved,
  formatAddress,
}: Props) {
  const [open, setOpen] = useState(false);
  const [booting, setBooting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const [mainValue, setMainValue] = useState<string>(
    (fieldMap.address ? form.getFieldValue(fieldMap.address) : '') || '',
  );
  const [mainOptions, setMainOptions] = useState<GoogleOption[]>([]);

  const [popupValue, setPopupValue] = useState('');
  const [popupOptions, setPopupOptions] = useState<GoogleOption[]>([]);

  const [draftLocation, setDraftLocation] = useState<LocationInfo | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const mainTokenRef = useRef<any>(null);
  const popupTokenRef = useRef<any>(null);

  const mainSuggestSeqRef = useRef(0);
  const popupSuggestSeqRef = useRef(0);
  const geocodeSeqRef = useRef(0);
  const reverseSeqRef = useRef(0);

  const skipNextIdleReverseRef = useRef(false);

  const clearLocationFields = useCallback(() => {
    const patch: Record<string, unknown> = {};

    if (fieldMap.address) patch[fieldMap.address] = undefined;
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

  const patchForm = useCallback(
    (loc: LocationInfo, writeAddress: boolean) => {
      const patch: Record<string, unknown> = {};

      if (writeAddress && fieldMap.address) {
        // 如果提供了自定义格式化函数，使用它；否则使用默认格式
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

      if (writeAddress) {
        setMainValue(formatAddress ? formatAddress(loc) : loc.formattedAddress);
        setError(undefined);

        if (fieldMap.address) {
          form.validateFields([fieldMap.address]);
        }
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

  const getSessionToken = useCallback(async (scope: 'main' | 'popup') => {
    const { placesLib } = await ensureGoogleMaps();
    const TokenCtor = (placesLib as any).AutocompleteSessionToken;

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

  const resetSessionToken = useCallback((scope: 'main' | 'popup') => {
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
    async (lat: number, lng: number) => {
      const seq = ++reverseSeqRef.current;
      const geocoder = await getGeocoder();

      const { results } = await geocoder.geocode({
        location: { lat, lng },
      });

      if (seq !== reverseSeqRef.current) return null;
      if (!results?.length) return null;

      const loc = normalizeGeocoderResult(results[0]);
      setDraftLocation(loc);
      setPopupValue(loc.formattedAddress);
      patchForm(loc, false);
      return loc;
    },
    [getGeocoder, patchForm],
  );

  const geocodeFreeText = useCallback(
    async (text: string, syncMap: boolean, syncPopupText: boolean) => {
      const keyword = text.trim();
      if (!keyword || keyword.length < minSearchLength) return null;

      const seq = ++geocodeSeqRef.current;
      const geocoder = await getGeocoder();

      const { results } = await geocoder.geocode({
        address: keyword,
      });

      if (seq !== geocodeSeqRef.current) return null;
      if (!results?.length) return null;

      const loc = normalizeGeocoderResult(results[0]);
      setDraftLocation(loc);
      patchForm(loc, false);

      if (syncPopupText) {
        setPopupValue(loc.formattedAddress);
      }

      if (syncMap) {
        moveMapTo(loc.lat, loc.lng);
      }

      return loc;
    },
    [getGeocoder, minSearchLength, moveMapTo, patchForm],
  );

  const fetchSuggestions = useCallback(
    async (keyword: string, scope: 'main' | 'popup') => {
      const text = keyword.trim();
      const isMain = scope === 'main';

      if (text.length < 2) {
        if (isMain) setMainOptions([]);
        else setPopupOptions([]);
        return;
      }

      const seqRef = isMain ? mainSuggestSeqRef : popupSuggestSeqRef;
      const currentSeq = ++seqRef.current;

      try {
        const { placesLib } = await ensureGoogleMaps();
        const AutocompleteSuggestion = (placesLib as any).AutocompleteSuggestion;

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
          .filter((item: any) => item?.placePrediction)
          .map((item: any) => {
            const prediction = item.placePrediction;
            const mainText = prediction?.mainText?.text || prediction?.text?.text || '';
            const secondaryText = prediction?.secondaryText?.text || '';

            return {
              value: prediction?.text?.text || mainText,
              label: (
                <div style={{ lineHeight: 1.4 }}>
                  <div>{mainText}</div>
                  {secondaryText ? (
                    <div style={{ fontSize: 12, color: '#999' }}>{secondaryText}</div>
                  ) : null}
                </div>
              ),
              rawSuggestion: item,
            };
          });

        if (isMain) {
          setMainOptions(nextOptions);
        } else {
          setPopupOptions(nextOptions);
        }
      } catch (error) {
        console.error('fetchSuggestions failed:', error);

        if (isMain) setMainOptions([]);
        else setPopupOptions([]);

        // 降级：即使联想失败，也保留自由输入解析
        if (text.length >= minSearchLength) {
          void geocodeFreeText(text, !isMain, !isMain);
        }
      }
    },
    [geocodeFreeText, getSessionToken, minSearchLength],
  );

  const resolveSuggestion = useCallback(
    async (option: GoogleOption, scope: 'main' | 'popup') => {
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
          patchForm(loc, true);
          setMainOptions([]);
          resetSessionToken('main');
        } else {
          setPopupValue(loc.formattedAddress);
          patchForm(loc, false);
          moveMapTo(loc.lat, loc.lng);
          setPopupOptions([]);
          resetSessionToken('popup');
        }
      } catch (error) {
        console.error('resolveSuggestion failed:', error);
      }
    },
    [moveMapTo, patchForm, resetSessionToken],
  );

  const initOrRefreshMap = useCallback(async () => {
    if (!mapContainerRef.current) return;

    setBooting(true);

    try {
      const { mapsLib } = await ensureGoogleMaps();
      const MapClass = mapsLib.Map;

      const currentLat = Number(fieldMap.lat ? form.getFieldValue(fieldMap.lat) : undefined);
      const currentLng = Number(fieldMap.lng ? form.getFieldValue(fieldMap.lng) : undefined);
      const hasCurrentPoint = Number.isFinite(currentLat) && Number.isFinite(currentLng);

      const center = draftLocation
        ? { lat: draftLocation.lat, lng: draftLocation.lng }
        : hasCurrentPoint
          ? { lat: currentLat, lng: currentLng }
          : { lat: 31.2304, lng: 121.4737 };

      const zoom = draftLocation || hasCurrentPoint ? 16 : 12;

      if (!mapRef.current) {
        mapRef.current = new MapClass(mapContainerRef.current, {
          center,
          zoom,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          gestureHandling: 'greedy',
        });

        mapRef.current.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (!e.latLng || !mapRef.current) return;
          mapRef.current.panTo(e.latLng);
        });

        mapRef.current.addListener('idle', async () => {
          if (skipNextIdleReverseRef.current) {
            skipNextIdleReverseRef.current = false;
            return;
          }

          const mapCenter = mapRef.current?.getCenter();
          if (!mapCenter) return;

          await reverseGeocode(mapCenter.lat(), mapCenter.lng());
        });
      } else {
        mapRef.current.setCenter(center);
        mapRef.current.setZoom(zoom);
      }
    } finally {
      setBooting(false);
    }
  }, [draftLocation, fieldMap.lat, fieldMap.lng, form, reverseGeocode]);

  useEffect(() => {
    const text = mainValue.trim();

    if (!text) {
      setMainOptions([]);
      clearLocationFields();
      return;
    }

    if (text.length < minSearchLength) return;

    const timer = window.setTimeout(() => {
      void geocodeFreeText(text, false, false);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [clearLocationFields, debounceMs, geocodeFreeText, mainValue, minSearchLength]);

  useEffect(() => {
    if (!open) return;

    const text = popupValue.trim();
    if (!text || text.length < minSearchLength) return;

    const timer = window.setTimeout(() => {
      void geocodeFreeText(text, true, false);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [debounceMs, geocodeFreeText, minSearchLength, open, popupValue]);

  const handleBlur = useCallback(() => {
    // 失去焦点时触发校验
    if (fieldMap.address) {
      console.log('fieldMap.address:', fieldMap.address);
      form.validateFields([fieldMap.address]);
    }
  }, [fieldMap.address, form]);

  const handleAfterOpenChange = (visible: boolean) => {
    if (!visible) return;

    requestAnimationFrame(() => {
      void initOrRefreshMap();
    });
  };

  return (
    <>
      <AutoComplete
        value={mainValue}
        options={mainOptions}
        style={{ width: '100%' }}
        status={error ? 'error' : undefined}
        onBlur={handleBlur}
        onSearch={(value) => {
          void fetchSuggestions(value, 'main');
          // 清空错误状态
          if (fieldMap.address) {
            form.setFields([{ name: fieldMap.address, errors: [] }]);
          }
        }}
        onChange={(value) => {
          setMainValue(value);

          if (fieldMap.address) {
            form.setFieldValue(fieldMap.address, value || undefined);
          }

          if (!value) {
            setMainOptions([]);
            clearLocationFields();
          }
        }}
        onSelect={(_, option) => {
          void resolveSuggestion(option as GoogleOption, 'main');
        }}
      >
        <Input
          placeholder={placeholder}
          suffix={
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setPopupValue(mainValue);
                setOpen(true);
              }}
            >
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
          }
        />
      </AutoComplete>

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
            <Button
              type="primary"
              onClick={() => {
                if (!draftLocation) return;
                patchForm(draftLocation, true);
                setOpen(false);
              }}
            >
              确认
            </Button>
          </Space>
        }
      >
        <Spin spinning={booting}>
          <div style={{ marginBottom: 12 }}>
            <AutoComplete
              value={popupValue}
              options={popupOptions}
              allowClear
              style={{ width: '100%' }}
              onSearch={(value) => {
                void fetchSuggestions(value, 'popup');
              }}
              onChange={(value) => {
                setPopupValue(value);
                if (!value) {
                  setPopupOptions([]);
                }
              }}
              onSelect={(_, option) => {
                void resolveSuggestion(option as GoogleOption, 'popup');
              }}
            >
              <Input placeholder="搜索地址或地标" />
            </AutoComplete>
          </div>

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

            {/* 固定中心图钉：拖动地图即选点 */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -100%)',
                pointerEvents: 'none',
                fontSize: 34,
                lineHeight: 1,
              }}
            >
              📍
            </div>
          </div>
        </Spin>
      </Modal>
    </>
  );
}
