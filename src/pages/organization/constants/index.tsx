import type { OptionItem } from '@/components/Segmented';

// 数据平台选项
export const DATA_PLATFORM_OPTIONS: OptionItem[] = [
  {
    label: 'Web',
    value: 'WEB',
    color: '#31C47F',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.999976 6H13M2.99998 4H3.09998M5.09959 4H5.19958M7.19919 4H7.29919M2.59998 12H11.4C12.5045 12 13.4 11.1046 13.4 10V4C13.4 2.89543 12.5045 2 11.4 2H2.59998C1.49541 2 0.599976 2.89543 0.599976 4V10C0.599976 11.1046 1.49541 12 2.59998 12Z"
          stroke="#9B9C9E"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    iconSelected: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.999976 6H13M2.99998 4H3.09998M5.09959 4H5.19958M7.19919 4H7.29919M2.59998 12H11.4C12.5045 12 13.4 11.1046 13.4 10V4C13.4 2.89543 12.5045 2 11.4 2H2.59998C1.49541 2 0.599976 2.89543 0.599976 4V10C0.599976 11.1046 1.49541 12 2.59998 12Z"
          stroke="#31C47F"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: 'Phone',
    value: 'APP',
    color: '#33C2C8',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 8.39961V2.59961C12 1.49504 11.1046 0.599609 10 0.599609H4C2.89543 0.599609 2 1.49504 2 2.59961V8.39961M12 8.39961V11.3996C12 12.5042 11.1046 13.3996 10 13.3996H4C2.89543 13.3996 2 12.5042 2 11.3996V8.39961M12 8.39961H2M6.5 10.9996H7.5"
          stroke="#9B9C9E"
          strokeOpacity="0.4"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    iconSelected: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 8.40001V2.60001C12 1.49544 11.1046 0.600006 10 0.600006H4C2.89543 0.600006 2 1.49544 2 2.60001V8.40001M12 8.40001V11.4C12 12.5046 11.1046 13.4 10 13.4H4C2.89543 13.4 2 12.5046 2 11.4V8.40001M12 8.40001H2M6.5 11H7.5"
          stroke="#33C2C8"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];
