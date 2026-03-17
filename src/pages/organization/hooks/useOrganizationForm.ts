import { useCallback, useState } from 'react';
import type {
  CreateOrganizationRequest,
  OrganizationType,
  TreeNodeData,
  VerifyOrganization,
} from '@pages/organization/dto';
import { useLanguage } from '@shared/hooks';

import { useThemeModal } from '@/components/Modal';
import { organizationApi } from '@/services/modules/organization/organizationApi';

/**
 * 组织表单数据接口
 */
export interface OrganizationFormData {
  orgName: string;
  orgType: OrganizationType;
  orgAddress?: string;
  orgCountryRegion?: string;
  orgPostalCode?: string;
  orgEmail?: string;
  orgUsername?: string;
  orgPhone?: string;
  orgDescription?: string;
  countryCode?: string;
  lat?: number;
  lng?: number;
  orgId?: string;
  description?: string;
  zipCode?: string;
  address?: string;
  regionCode?: string;
}

/**
 * 邮箱验证结果接口
 */
export interface EmailVerifyResult {
  userExists?: boolean;
  existingUsername?: string;
  existingPhone?: string;
  userType?: OrganizationType;
}

/**
 * 组织创建 Hook - 封装组织创建相关的所有业务逻辑
 */
export const useOrganizationForm = (currentParentNode?: TreeNodeData) => {
  const { t } = useLanguage();

  const { success, warning } = useThemeModal();

  // 邮箱验证状态
  const [userExists, setUserExists] = useState<boolean>(false);
  const [existingUsername, setExistingUsername] = useState<string>('');
  const [existingPhone, setExistingPhone] = useState<string>('');
  const [userType, setUserType] = useState<OrganizationType>();
  const [loading, setLoading] = useState<boolean>(false);

  // 组织验证状态(创建)
  const [verifyResult, setVerifyResult] = useState<VerifyOrganization>({
    valid: false,
    isCountryInScope: true,
    isOwnerTypeValid: true,
    isOrgTypeAllowed: true,
    isBdScopesAvailable: false,
    isOrganizationExists: false,
    isOrganizationSimilar: false,
    isPhoneExists: false,
    failReasons: [],
    timestamp: 0,
  });

  // 组织验证状态(修改)
  const [verifyResultByUpdate, setVerifyResultByUpdate] = useState<any>({
    valid: false,
    isOrganizationNotFound: false,
    isPylontech: false,
    isOrganizationExists: false,
    isOrganizationSimilar: false,
    isOrgTypeChangeAllowed: true,
    isCountryInScope: true,
  });

  const requestParams = useCallback(
    (values: OrganizationFormData) => {
      return {
        orgName: values.orgName,
        orgType: values.orgType,
        parentOrgId: currentParentNode?.key || '',
        description: values.orgDescription,
        remark: values.orgDescription,
        countryCode: values.countryCode || '',
        zipCode: values.orgPostalCode || '',
        ownerEmail: values.orgEmail || '',
        ownerUserName: values.orgUsername || '',
        ownerPhone: values.orgPhone || '',
        address: values.orgAddress || '',
        latitude: values.lat,
        longitude: values.lng,
        regionCode: values.orgCountryRegion || '',
        orgId: values.orgId || '',
      };
    },
    [currentParentNode],
  );

  /**
   * 验证邮箱
   * @param email - 邮箱地址
   * @param withGlobalLoading - 是否显示全局loading，默认为 false
   */
  const verifyEmail = useCallback(
    async (
      email: string,
      withGlobalLoading?: boolean,
      onCancel?: () => void,
    ): Promise<EmailVerifyResult> => {
      const defaultResult: EmailVerifyResult = {
        userExists: false,
        existingUsername: '',
        existingPhone: '',
        userType: undefined,
      };

      // 根据参数决定是否显示 loading
      if (withGlobalLoading) {
        setLoading(true);
      }
      try {
        const response = await organizationApi.verifyEmail({ email: email || '' });
        const result: EmailVerifyResult = {
          userExists: response.data.exists || false,
          existingUsername: response.data.username || '',
          existingPhone: response.data.phone || '',
          userType: response.data.userType || undefined,
        };

        if (response?.data?.userType === 'INTERNAL' || response?.data?.userType === 'GUEST') {
          if (onCancel) {
            warning({
              title: 'Email Exists !',
              content: 'This email address is already in use.',
              onOk: () => {
                onCancel();
              },
            });
          }
        } else {
          setUserExists(result.userExists || false);
          setExistingUsername(result.existingUsername || '');
          setExistingPhone(result.existingPhone || '');
          setUserType(result.userType || undefined);
        }
        return result;
      } catch {
        setUserExists(false);
        setExistingUsername('');
        setExistingPhone('');
        return defaultResult;
      } finally {
        // 只在开启了 loading 的情况下关闭
        if (withGlobalLoading) {
          setLoading(false);
        }
      }
    },
    [warning],
  );

  /**
   * 验证组织信息(创建)
   */
  const verifyOrganization = useCallback(
    async (values: OrganizationFormData) => {
      const defaultResult: VerifyOrganization = {
        valid: false,
        isCountryInScope: true,
        isOwnerTypeValid: true,
        isOrgTypeAllowed: true,
        isBdScopesAvailable: false,
        isOrganizationExists: false,
        isOrganizationSimilar: false,
        isPhoneExists: false,
        failReasons: [],
        timestamp: Date.now(),
      };

      try {
        const verifyParams: CreateOrganizationRequest = requestParams(values);

        const response = await organizationApi.verify(verifyParams);
        const result = { ...response.data, timestamp: Date.now() };
        setVerifyResult(result);
        return result;
      } catch {
        setVerifyResult(defaultResult);
        return defaultResult;
      }
    },
    [requestParams],
  );

  /**
   * 验证组织信息(更新)
   */
  const verifyOrganizationByUpdate = useCallback(
    async (values: OrganizationFormData) => {
      const defaultResult: VerifyOrganization = {
        isOwnerTypeValid: true,
        isOrgTypeAllowed: true,
        isBdScopesAvailable: true,
        isOrganizationNotFound: false,
        isPylontech: false,
        isOrganizationExists: false,
        isOrganizationSimilar: false,
        similarOrgName: null,
        isOrgTypeChangeAllowed: true,
        isCountryInScope: true,
        valid: false,
      };
      try {
        const verifyParams: CreateOrganizationRequest = requestParams(values);
        const response = await organizationApi.verifyByUpdate(verifyParams);
        const result = { ...response.data, timestamp: Date.now() };
        setVerifyResultByUpdate(result);
        return result;
      } catch {
        setVerifyResultByUpdate(defaultResult);
        return defaultResult;
      }
    },
    [requestParams],
  );

  /**
   * 确认创建组织（处理已存在用户的情况）
   */
  const handleConfirmWithExistingUser = useCallback(
    async (values: OrganizationFormData, username: string, phone: string) => {
      const requestData: CreateOrganizationRequest = requestParams({
        ...values,
        orgUsername: username,
        orgPhone: phone,
      });

      const response = await organizationApi.create(requestData);

      return response;
    },
    [requestParams],
  );

  /**
   * 创建新组织
   */
  const handleCreateOrganization = useCallback(
    async (values: OrganizationFormData) => {
      const requestData: CreateOrganizationRequest = requestParams(values);
      const response = await organizationApi.create(requestData);

      return response;
    },
    [requestParams],
  );

  /**
   * 提交表单 - 核心业务逻辑
   */
  const handleSubmit = useCallback(
    async (values: OrganizationFormData, onRefresh?: () => void) => {
      if (!values.orgCountryRegion) {
        return { success: false, code: 422 };
      }

      // 开始全局 loading
      setLoading(true);

      try {
        // ===== 第一步：验证组织信息 =====
        const verifyData = await verifyOrganization(values);

        // 如果验证失败，直接返回
        if (!verifyData.valid) {
          return { success: false, reason: verifyData?.failReasons, code: 423 };
        }

        // ===== 第二步：验证邮箱 =====
        const emailResult = await verifyEmail(values.orgEmail || '');

        // ===== 第三步：创建组织 =====
        let response;

        // 关键判断：只有当 userExists 为 true 时才使用已存在用户

        if (emailResult.userType === 'INTERNAL' || emailResult.userType === 'GUEST') {
          return { success: false, reason: 'user_type_mismatch', emailResult };
        }

        if (emailResult?.userExists) {
          // 用户已存在，使用现有用户信息创建组织
          response = await handleConfirmWithExistingUser(
            values,
            emailResult.existingUsername || '',
            emailResult.existingPhone || '',
          );
        } else {
          // 用户不存在，创建新组织和用户
          response = await handleCreateOrganization(values);
        }

        // ===== 第四步：检查创建结果 =====
        if (response.code === 200) {
          // 显示成功提示（在回调中刷新列表）
          onRefresh?.();
          success({
            title: 'Success !',
            content: t('org.toast.create_success'),
          });

          return { success: true, data: response };
        } else {
          // 创建失败时不刷新列表，直接返回错误
          return { success: false, reason: 'create_failed', response };
        }
      } catch (error) {
        // 发生异常时不刷新列表，直接返回错误
        return { success: false, reason: 'error', error };
      } finally {
        // 所有请求结束后关闭 loading
        setLoading(false);
      }
    },
    [
      verifyOrganization,
      verifyEmail,
      handleConfirmWithExistingUser,
      handleCreateOrganization,
      success,
      t,
    ],
  );

  /**
   * 重置验证状态
   */
  const resetVerifyStatus = useCallback(() => {
    setUserExists(false);
    setExistingUsername('');
    setExistingPhone('');
    setVerifyResult({
      valid: false,
      isCountryInScope: true,
      isOwnerTypeValid: true,
      isOrgTypeAllowed: true,
      isBdScopesAvailable: true,
      isOrganizationExists: false,
      isOrganizationSimilar: false,
      isPhoneExists: false,
      failReasons: [],
      timestamp: 0,
    });
  }, []);

  return {
    // 状态
    loading,
    userExists,
    existingUsername,
    existingPhone,
    userType,
    verifyResult,
    verifyResultByUpdate,

    // 方法
    setLoading,
    verifyEmail,
    verifyOrganization,
    handleSubmit,
    resetVerifyStatus,
    requestParams,
    verifyOrganizationByUpdate,
  };
};
