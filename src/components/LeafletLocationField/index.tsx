import { useEffect, useMemo, useRef, useState } from 'react';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Space, Typography } from 'antd';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

import type { LeafletLocationValue, LocationPoint } from '@/shared/hooks/useLeafletLocationField';
import {
  defaultGeocode,
  defaultReverseGeocode,
  useLeafletLocationField,
} from '@/shared/hooks/useLeafletLocationField';

type LeafletLocationPickerFieldProps = {
  value?: LeafletLocationValue | null;
  onChange?: (value: LeafletLocationValue | null) => void;

  placeholder?: string;
  disabled?: boolean;

  modalTitle?: string;
  height?: number;
  zoom?: number;
  focusZoom?: number;
  defaultCenter?: [number, number];

  tileUrl?: string;
  tileAttribution?: string;

  geocode?: typeof defaultGeocode;
  reverseGeocode?: typeof defaultReverseGeocode;

  onResolved?: (value: LeafletLocationValue | null) => void;
};

const DEFAULT_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const DEFAULT_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function isValidPoint(point: LocationPoint | null | undefined): point is LocationPoint {
  return !!point && Number.isFinite(point.lat) && Number.isFinite(point.lng);
}

function MapClickSelector({
  disabled,
  onPick,
}: {
  disabled?: boolean;
  onPick: (point: LocationPoint) => void;
}) {
  useMapEvents({
    click(e) {
      if (disabled) return;
      onPick({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return null;
}

function MapMoveTracker({
  onCenterChange,
}: {
  onCenterChange: (center: [number, number]) => void;
}) {
  const map = useMapEvents({
    moveend() {
      const c = map.getCenter();
      onCenterChange([c.lat, c.lng]);
    },
  });

  return null;
}

function MapSync({
  openTick,
  point,
  center,
  focusZoom = 15,
}: {
  openTick: number;
  point: LocationPoint | null;
  center: [number, number];
  focusZoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize();

      if (point) {
        map.setView([point.lat, point.lng], Math.max(map.getZoom(), focusZoom), {
          animate: false,
        });
      } else {
        map.setView(center, map.getZoom(), {
          animate: false,
        });
      }
    }, 100);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, openTick, point?.lat, point?.lng, center[0], center[1], focusZoom]);

  useEffect(() => {
    if (!point) return;

    map.setView([point.lat, point.lng], Math.max(map.getZoom(), focusZoom), {
      animate: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, point?.lat, point?.lng, focusZoom]);

  return null;
}

function DraftMarker({
  point,
  disabled,
  onPick,
}: {
  point: LocationPoint | null;
  disabled?: boolean;
  onPick: (point: LocationPoint) => void;
}) {
  const markerRef = useRef<L.Marker | null>(null);

  const icon = useMemo(
    () =>
      L.divIcon({
        className: 'leaflet-location-pin-wrap',
        html: '<div class="leaflet-location-pin"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    [],
  );

  if (!isValidPoint(point)) return null;

  return (
    <Marker
      ref={markerRef}
      position={[point.lat, point.lng]}
      icon={icon}
      draggable={!disabled}
      eventHandlers={{
        dragend() {
          const marker = markerRef.current;
          if (!marker) return;

          const c = marker.getLatLng();
          onPick({
            lat: c.lat,
            lng: c.lng,
          });
        },
      }}
    />
  );
}

export default function LeafletLocationPickerField({
  value,
  onChange,
  placeholder = '请选择位置',
  disabled = false,

  modalTitle = '选择位置',
  height = 420,
  zoom = 10,
  focusZoom = 15,
  defaultCenter = [31.49, 120.312],

  tileUrl = DEFAULT_TILE_URL,
  tileAttribution = DEFAULT_TILE_ATTRIBUTION,

  geocode = defaultGeocode,
  reverseGeocode = defaultReverseGeocode,

  onResolved,
}: LeafletLocationPickerFieldProps) {
  const {
    open,
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
  } = useLeafletLocationField({
    value,
    onChange,
    onResolved,
    defaultCenter,
    geocode,
    reverseGeocode,
  });

  const [openTick, setOpenTick] = useState(0);

  // 使用 requestAnimationFrame 避免在 effect 中同步调用 setState
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        setOpenTick((prev) => prev + 1);
      });
    }
  }, [open]);

  const mapInitialCenter: [number, number] = isValidPoint(draftPoint)
    ? [draftPoint.lat, draftPoint.lng]
    : mapCenter;

  const handleSearch = async () => {
    try {
      const found = await searchAndSelect();
      if (!found) {
        message.warning('未找到匹配地址');
      }
    } catch (error) {
      console.error(error);
      message.error('地址搜索失败，请稍后重试');
    }
  };

  const handlePick = async (point: LocationPoint) => {
    try {
      await selectPoint(point);
    } catch (error) {
      console.error(error);
      message.warning('位置解析失败');
    }
  };

  const handleUseMapCenter = async () => {
    try {
      const point = {
        lat: Number(mapCenter[0].toFixed(6)),
        lng: Number(mapCenter[1].toFixed(6)),
      };
      await selectPoint(point, { syncCenter: true });
    } catch (error) {
      console.error(error);
      message.warning('位置解析失败');
    }
  };

  return (
    <div>
      <style>
        {`
          .leaflet-location-pin-wrap {
            background: transparent;
            border: none;
          }
          .leaflet-location-pin {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #1677ff;
            border: 3px solid #fff;
            box-shadow: 0 1px 6px rgba(0,0,0,0.35);
          }
          .leaflet-center-crosshair {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 22px;
            height: 22px;
            margin-left: -11px;
            margin-top: -11px;
            pointer-events: none;
            z-index: 400;
          }
          .leaflet-center-crosshair::before,
          .leaflet-center-crosshair::after {
            content: '';
            position: absolute;
            background: #ff4d4f;
          }
          .leaflet-center-crosshair::before {
            left: 10px;
            top: 0;
            width: 2px;
            height: 22px;
          }
          .leaflet-center-crosshair::after {
            left: 0;
            top: 10px;
            width: 22px;
            height: 2px;
          }
        `}
      </style>

      <Input
        value={displayText}
        readOnly
        placeholder={placeholder}
        disabled={disabled}
        onClick={() => {
          if (!disabled) openModal();
        }}
        suffix={
          <EnvironmentOutlined
            onClick={(e) => {
              e.stopPropagation();
              if (!disabled) openModal();
            }}
            style={{
              cursor: disabled ? 'not-allowed' : 'pointer',
              color: disabled ? '#bfbfbf' : '#1677ff',
            }}
          />
        }
      />

      <Modal
        open={open}
        onCancel={closeModal}
        title={modalTitle}
        width={900}
        destroyOnClose={false}
        okText="确认"
        cancelText="取消"
        onOk={() => {
          if (!hasDraftPoint) {
            message.warning('请先选择位置');
            return;
          }
          confirmSelection();
        }}
      >
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Input.Search
            value={modalKeyword}
            onChange={(e) => setModalKeyword(e.target.value)}
            onSearch={handleSearch}
            placeholder="输入完整地址后点击搜索"
            enterButton="搜索"
            allowClear
            loading={searching}
            disabled={disabled}
          />

          <Space wrap>
            <Button onClick={handleUseMapCenter} loading={resolving} disabled={disabled}>
              使用当前地图中心点
            </Button>

            <Button onClick={clearDraft} disabled={disabled}>
              清空本次选择
            </Button>

            <Button
              danger
              type="text"
              onClick={clearCommitted}
              disabled={disabled || !hasCommittedPoint}
            >
              清空已保存值
            </Button>
          </Space>

          <div>
            <Typography.Text type="secondary">
              当前回填文本：{draftDisplayText || '未选择'}
            </Typography.Text>
            <div style={{ marginTop: 4 }}>
              <Typography.Text type="secondary">
                国家：{draftMeta?.country || '-'} / 省州：{draftMeta?.state || '-'} / 城市：
                {draftMeta?.city || draftMeta?.town || draftMeta?.village || '-'}
              </Typography.Text>
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              height,
              border: '1px solid #d9d9d9',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <MapContainer
              center={mapInitialCenter}
              zoom={zoom}
              scrollWheelZoom
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer attribution={tileAttribution} url={tileUrl} />

              <MapSync
                openTick={openTick}
                point={draftPoint}
                center={mapCenter}
                focusZoom={focusZoom}
              />

              <MapClickSelector disabled={disabled} onPick={handlePick} />

              <MapMoveTracker onCenterChange={updateMapCenter} />

              <DraftMarker point={draftPoint} disabled={disabled} onPick={handlePick} />
            </MapContainer>

            <div className="leaflet-center-crosshair" />
          </div>

          <Typography.Text type="secondary">
            点击地图可直接选点；拖动地图后，可使用当前中心点；也可以拖拽蓝色标记微调位置。
          </Typography.Text>
        </Space>
      </Modal>
    </div>
  );
}
