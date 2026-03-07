import { useCallback, useState } from 'react';
import { Alert, Button, Form, type FormInstance, Modal, Space, Spin, Typography } from 'antd';

import { FormAutoComplete } from '@/components';
import { useLanguage } from '@/shared/hooks/useLanguage';

import { useAddressPickerMap } from './hooks/useAddressPickerMap';
import type { FieldMap, GoogleOption, LocationInfo } from './types/addressPickerTypes';
import { stripPostalCodeText } from './utils/addressUtils';

type Props = {
  form: FormInstance;
  fieldMap: FieldMap;
  placeholder?: string;
  minSearchLength?: number;
  popupTitle?: string;
  onResolved?: (location: LocationInfo) => void;
  formatAddress?: (location: LocationInfo) => string;
};

export default function AddressPickerAutoComplete({
  form,
  fieldMap,
  placeholder = '',
  minSearchLength = 3,
  popupTitle = '选择地址',
  onResolved,
  formatAddress,
}: Props) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [popupValue, setPopupValue] = useState('');

  const addressValue = Form.useWatch(fieldMap.address, form) ?? '';

  const map = useAddressPickerMap({
    fieldMap,
    form,
    minSearchLength,
    onResolved,
    formatAddress,
  });

  // 提取所有需要的值，避免在 render 中直接访问 map 对象
  const {
    booting,
    dragging,
    error,
    locating,
    mainOptions,
    popupOptions,
    resolvingCenter,
    draftLocation,
    mapContainerRef,
    clearDerivedFields,
    debouncedFetchSuggestions,
    geocodeText,
    initOrRefreshMap,
    locateCurrentPosition,
    resetSessionToken,
    resolveCurrentCenter,
    resolveSuggestion,
    setMainOptions,
    setPopupOptions,
    writeLocationToForm,
  } = map;

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
    [clearDerivedFields, fieldMap.address, form, resetSessionToken, setMainOptions],
  );

  const handleMainBlur = useCallback(async () => {
    const text = String(form.getFieldValue(fieldMap.address) ?? '').trim();
    if (text.length < minSearchLength) return;

    if (draftLocation?.displayAddress === text) return;

    await geocodeText(text, { writeAddress: true });
  }, [draftLocation?.displayAddress, fieldMap.address, form, geocodeText, minSearchLength]);

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
    [resetSessionToken, setPopupOptions],
  );

  const handlePopupBlur = useCallback(async () => {
    const text = popupValue.trim();
    if (text.length < minSearchLength) return;

    if (draftLocation?.displayAddress === text) return;

    await geocodeText(text, {
      syncMap: true,
      syncPopupText: true,
      writeAddress: true,
    });
  }, [draftLocation?.displayAddress, geocodeText, minSearchLength, popupValue]);

  const handleOpenModal = useCallback(() => {
    const currentAddress = String(form.getFieldValue(fieldMap.address) ?? '');
    setPopupValue(stripPostalCodeText(currentAddress));
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
                writeLocationToForm(loc, { writeAddress: true, syncPopupText: true });
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
                : '拖动地图，使中心图钉对准目标位置；停止后会自动回填，也可手动点击"取地图中心点"。'
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

            {(resolvingCenter || locating) && (
              <div
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 12,
                  background: 'rgba(255,255,255,0.95)',
                  border: '1px solid #f0f0f0',
                  borderRadius: 8,
                  padding: '6px 10px',
                  fontSize: 12,
                }}
              >
                {locating ? '正在定位当前位置…' : '正在解析中心点…'}
              </div>
            )}
          </div>

          {error ? (
            <Typography.Text type="danger" style={{ display: 'block', marginTop: 12 }}>
              {map.error}
            </Typography.Text>
          ) : null}
        </Spin>
      </Modal>
    </>
  );
}
