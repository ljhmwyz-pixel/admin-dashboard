import { useCallback, useMemo, useRef, useState } from 'react';

export type LocationPoint = {
  lat: number;
  lng: number;
};

export type LocationMeta = {
  displayName: string;
  country: string;
  countryCode: string;
  state: string;
  stateDistrict: string;
  county: string;
  city: string;
  town: string;
  village: string;
  suburb: string;
  postcode: string;
  raw: unknown;
};

export type LeafletLocationValue = {
  displayText: string;
  lat: number | null;
  lng: number | null;

  country: string;
  countryCode: string;
  state: string;
  stateDistrict: string;
  county: string;
  city: string;
  town: string;
  village: string;
  suburb: string;
  postcode: string;

  rawMeta: unknown | null;
};

export type GeocodeResult = {
  lat: number;
  lng: number;
  displayName?: string;
};

type UseLeafletLocationFieldParams = {
  value?: LeafletLocationValue | null;
  onChange?: (value: LeafletLocationValue | null) => void;
  onResolved?: (value: LeafletLocationValue | null) => void;

  defaultCenter?: [number, number];

  geocode?: (keyword: string) => Promise<GeocodeResult | null>;
  reverseGeocode?: (point: LocationPoint) => Promise<LocationMeta | null>;
  formatDisplayText?: (meta: LocationMeta | null, point: LocationPoint | null) => string;

  cacheTtlMs?: number;
};

const DEFAULT_CENTER: [number, number] = [31.49, 120.312];
const DEFAULT_CACHE_TTL = 1000 * 60 * 5;

function round6(n: number) {
  return Number(n.toFixed(6));
}

function emptyValue(): LeafletLocationValue {
  return {
    displayText: '',
    lat: null,
    lng: null,
    country: '',
    countryCode: '',
    state: '',
    stateDistrict: '',
    county: '',
    city: '',
    town: '',
    village: '',
    suburb: '',
    postcode: '',
    rawMeta: null,
  };
}

function toPoint(value?: LeafletLocationValue | null): LocationPoint | null {
  if (
    typeof value?.lat === 'number' &&
    Number.isFinite(value.lat) &&
    typeof value?.lng === 'number' &&
    Number.isFinite(value.lng)
  ) {
    return {
      lat: value.lat,
      lng: value.lng,
    };
  }
  return null;
}

export async function defaultGeocode(keyword: string): Promise<GeocodeResult | null> {
  const q = keyword.trim();
  if (!q) return null;

  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', q);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('addressdetails', '1');

  const res = await fetch(url.toString(), {
    headers: {
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    },
  });

  if (!res.ok) {
    throw new Error(`Geocode failed: HTTP ${res.status}`);
  }

  const data = (await res.json()) as Array<{
    lat: string;
    lon: string;
    display_name?: string;
  }>;

  if (!data.length) return null;

  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
    displayName: data[0].display_name,
  };
}

export async function defaultReverseGeocode(point: LocationPoint): Promise<LocationMeta | null> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('lat', String(point.lat));
  url.searchParams.set('lon', String(point.lng));
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');

  const res = await fetch(url.toString(), {
    headers: {
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    },
  });

  if (!res.ok) {
    throw new Error(`Reverse geocode failed: HTTP ${res.status}`);
  }

  const data = (await res.json()) as {
    display_name?: string;
    address?: {
      country?: string;
      country_code?: string;
      state?: string;
      state_district?: string;
      county?: string;
      city?: string;
      town?: string;
      village?: string;
      suburb?: string;
      postcode?: string;
    };
  };

  const a = data.address;
  if (!a) return null;

  return {
    displayName: data.display_name || '',
    country: a.country || '',
    countryCode: (a.country_code || '').toUpperCase(),
    state: a.state || '',
    stateDistrict: a.state_district || '',
    county: a.county || '',
    city: a.city || '',
    town: a.town || '',
    village: a.village || '',
    suburb: a.suburb || '',
    postcode: a.postcode || '',
    raw: data,
  };
}

function defaultFormatDisplayText(meta: LocationMeta | null, point: LocationPoint | null) {
  if (meta?.displayName) return meta.displayName;

  const cityText = meta?.city || meta?.town || meta?.village || '';
  const regionText = [cityText, meta?.state, meta?.country].filter(Boolean).join(' / ');
  if (regionText) return regionText;

  if (point) return `${point.lat}, ${point.lng}`;

  return '';
}

function buildValue(
  point: LocationPoint | null,
  meta: LocationMeta | null,
  formatDisplayText: (meta: LocationMeta | null, point: LocationPoint | null) => string,
): LeafletLocationValue | null {
  if (!point) return null;

  return {
    displayText: formatDisplayText(meta, point),
    lat: point.lat,
    lng: point.lng,

    country: meta?.country || '',
    countryCode: meta?.countryCode || '',
    state: meta?.state || '',
    stateDistrict: meta?.stateDistrict || '',
    county: meta?.county || '',
    city: meta?.city || '',
    town: meta?.town || '',
    village: meta?.village || '',
    suburb: meta?.suburb || '',
    postcode: meta?.postcode || '',

    rawMeta: meta?.raw ?? null,
  };
}

export function useLeafletLocationField(params: UseLeafletLocationFieldParams = {}) {
  const {
    value,
    onChange,
    onResolved,
    defaultCenter = DEFAULT_CENTER,
    geocode = defaultGeocode,
    reverseGeocode = defaultReverseGeocode,
    formatDisplayText = defaultFormatDisplayText,
    cacheTtlMs = DEFAULT_CACHE_TTL,
  } = params;

  const [open, setOpen] = useState(false);
  const [modalKeyword, setModalKeyword] = useState('');
  const [draftPoint, setDraftPoint] = useState<LocationPoint | null>(null);
  const [draftMeta, setDraftMeta] = useState<LocationMeta | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [searching, setSearching] = useState(false);
  const [resolving, setResolving] = useState(false);

  const geocodeCacheRef = useRef(new Map<string, { ts: number; data: GeocodeResult | null }>());
  const reverseCacheRef = useRef(new Map<string, { ts: number; data: LocationMeta | null }>());

  const lastRequestAtRef = useRef(0);
  const resolveSeqRef = useRef(0);
  const searchSeqRef = useRef(0);

  const committedPoint = toPoint(value);
  const displayText = value?.displayText || '';

  const draftDisplayText = useMemo(() => {
    return formatDisplayText(draftMeta, draftPoint);
  }, [draftMeta, draftPoint, formatDisplayText]);

  const waitForGap = useCallback(async () => {
    const now = Date.now();
    const gap = now - lastRequestAtRef.current;
    const minGap = 1100;

    if (gap < minGap) {
      await new Promise((resolve) => window.setTimeout(resolve, minGap - gap));
    }

    lastRequestAtRef.current = Date.now();
  }, []);

  const getCachedGeocode = useCallback(
    (keyword: string) => {
      const key = keyword.trim().toLowerCase();
      const cached = geocodeCacheRef.current.get(key);
      if (!cached) return undefined;
      if (Date.now() - cached.ts > cacheTtlMs) {
        geocodeCacheRef.current.delete(key);
        return undefined;
      }
      return cached.data;
    },
    [cacheTtlMs],
  );

  const setCachedGeocode = useCallback((keyword: string, data: GeocodeResult | null) => {
    const key = keyword.trim().toLowerCase();
    geocodeCacheRef.current.set(key, {
      ts: Date.now(),
      data,
    });
  }, []);

  const getCachedReverse = useCallback(
    (point: LocationPoint) => {
      const key = `${round6(point.lat)},${round6(point.lng)}`;
      const cached = reverseCacheRef.current.get(key);
      if (!cached) return undefined;
      if (Date.now() - cached.ts > cacheTtlMs) {
        reverseCacheRef.current.delete(key);
        return undefined;
      }
      return cached.data;
    },
    [cacheTtlMs],
  );

  const setCachedReverse = useCallback((point: LocationPoint, data: LocationMeta | null) => {
    const key = `${round6(point.lat)},${round6(point.lng)}`;
    reverseCacheRef.current.set(key, {
      ts: Date.now(),
      data,
    });
  }, []);

  const syncDraftFromValue = useCallback(() => {
    const point = toPoint(value);
    const meta =
      point && value
        ? {
            displayName: value.displayText || '',
            country: value.country || '',
            countryCode: value.countryCode || '',
            state: value.state || '',
            stateDistrict: value.stateDistrict || '',
            county: value.county || '',
            city: value.city || '',
            town: value.town || '',
            village: value.village || '',
            suburb: value.suburb || '',
            postcode: value.postcode || '',
            raw: value.rawMeta,
          }
        : null;

    setDraftPoint(point);
    setDraftMeta(meta);
    setModalKeyword(value?.displayText || '');

    if (point) {
      setMapCenter([point.lat, point.lng]);
    } else {
      setMapCenter(defaultCenter);
    }
  }, [defaultCenter, value]);

  const openModal = useCallback(() => {
    syncDraftFromValue();
    setOpen(true);
  }, [syncDraftFromValue]);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const resolveMeta = useCallback(
    async (point: LocationPoint) => {
      const seq = ++resolveSeqRef.current;
      setResolving(true);

      try {
        const cached = getCachedReverse(point);
        if (cached !== undefined) {
          if (seq === resolveSeqRef.current) {
            setDraftMeta(cached);
          }
          return cached;
        }

        await waitForGap();
        const meta = await reverseGeocode(point);
        setCachedReverse(point, meta);

        if (seq !== resolveSeqRef.current) return null;

        setDraftMeta(meta);
        return meta;
      } finally {
        if (seq === resolveSeqRef.current) {
          setResolving(false);
        }
      }
    },
    [getCachedReverse, reverseGeocode, setCachedReverse, waitForGap],
  );

  const selectPoint = useCallback(
    async (point: LocationPoint, options?: { syncCenter?: boolean }) => {
      const normalized = {
        lat: round6(point.lat),
        lng: round6(point.lng),
      };

      setDraftPoint(normalized);

      if (options?.syncCenter !== false) {
        setMapCenter([normalized.lat, normalized.lng]);
      }

      await resolveMeta(normalized);
    },
    [resolveMeta],
  );

  const searchAndSelect = useCallback(
    async (rawKeyword?: string) => {
      const keyword = (rawKeyword ?? modalKeyword).trim();
      if (!keyword) return false;

      const seq = ++searchSeqRef.current;
      setSearching(true);

      try {
        let result = getCachedGeocode(keyword);

        if (result === undefined) {
          await waitForGap();
          result = await geocode(keyword);
          setCachedGeocode(keyword, result);
        }

        if (seq !== searchSeqRef.current) return false;
        if (!result) return false;

        setModalKeyword(keyword);

        const point = {
          lat: round6(result.lat),
          lng: round6(result.lng),
        };

        setDraftPoint(point);
        setMapCenter([point.lat, point.lng]);

        await resolveMeta(point);
        return true;
      } finally {
        if (seq === searchSeqRef.current) {
          setSearching(false);
        }
      }
    },
    [geocode, getCachedGeocode, modalKeyword, resolveMeta, setCachedGeocode, waitForGap],
  );

  const useCurrentMapCenter = useCallback(async () => {
    const point = {
      lat: round6(mapCenter[0]),
      lng: round6(mapCenter[1]),
    };

    await selectPoint(point, { syncCenter: true });
  }, [mapCenter, selectPoint]);

  const confirmSelection = useCallback(() => {
    const nextValue = buildValue(draftPoint, draftMeta, formatDisplayText);

    onChange?.(nextValue);
    onResolved?.(nextValue);
    setOpen(false);
  }, [draftMeta, draftPoint, formatDisplayText, onChange, onResolved]);

  const clearDraft = useCallback(() => {
    setDraftPoint(null);
    setDraftMeta(null);
    setModalKeyword('');
    setMapCenter(defaultCenter);
  }, [defaultCenter]);

  const clearCommitted = useCallback(() => {
    const next = null;
    onChange?.(next);
    onResolved?.(next);
    clearDraft();
  }, [clearDraft, onChange, onResolved]);

  const updateMapCenter = useCallback((center: [number, number]) => {
    setMapCenter([round6(center[0]), round6(center[1])]);
  }, []);

  const hasDraftPoint = !!draftPoint;
  const hasCommittedPoint = !!committedPoint;

  return {
    open,
    setOpen,
    openModal,
    closeModal,

    displayText,
    modalKeyword,
    setModalKeyword,

    draftPoint,
    draftMeta,
    draftDisplayText,

    mapCenter,
    updateMapCenter,

    searching,
    resolving,

    hasDraftPoint,
    hasCommittedPoint,

    selectPoint,
    searchAndSelect,
    useCurrentMapCenter,
    confirmSelection,
    clearDraft,
    clearCommitted,

    emptyValue,
  };
}
