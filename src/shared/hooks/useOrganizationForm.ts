import { useCallback, useState } from 'react';

import { FormModal } from '@/components';
import { loadOrganizationData } from '@/features/organization/services/organizationService';
import { organizationApi } from '@/services/modules/organization/organizationApi';
import { useGlobalLoading } from '@/shared/hooks/useGlobalLoading';
import { useLanguage } from '@/shared/hooks/useLanguage';
import type { OrganizationType } from '@/shared/types/organization';
import type {
  CreateOrganizationRequest,
  TreeNodeData,
  VerifyOrganization,
} from '@/shared/types/organization';

/**
 * 组织表单数据接口
 */
export interface OrganizationFormData {
  orgName: string;
  orgType: OrganizationType;
  orgAddress?: string;
  orgCountryRegion?: string;
  orgPostalCode?: string;
  orgEmail: string;
  orgUsername?: string;
  orgPhone?: string;
  orgDescription?: string;
  countryCode?: string;
  lat?: number;
  lng?: number;
}

/**
 * 邮箱验证结果接口
 */
export interface EmailVerifyResult {
  userExists?: boolean;
  existingUsername?: string;
  existingPhone?: string;
  userType?: string;
}

/**
 * 组织创建 Hook - 封装组织创建相关的所有业务逻辑
 */
export const useOrganizationForm = (currentParentNode?: TreeNodeData) => {
  const { showLoading, hideLoading, withLoading } = useGlobalLoading();

  const { t } = useLanguage();

  const { success } = FormModal();

  // 邮箱验证状态
  const [userExists, setUserExists] = useState<boolean>(false);
  const [existingUsername, setExistingUsername] = useState<string>('');
  const [existingPhone, setExistingPhone] = useState<string>('');
  const [userType, setUserType] = useState<string>('');

  // 组织验证状态
  const [verifyResult, setVerifyResult] = useState<VerifyOrganization>({
    isOrganizationExists: false,
    isOrganizationSimilar: false,
    isPhoneExists: false,
    isScope: false,
    timestamp: 0,
  });

  // TODO 参数需要重新处理
  const requestParams = useCallback((values: OrganizationFormData) => {
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
      latitude: values.lat ? 0 : undefined,
      longitude: values.lng ? 0 : undefined,
      bdCountryScopes: values.orgCountryRegion,
    };
  }, []);

  /**
   * 验证邮箱
   * @param email - 邮箱地址
   * @param withGlobalLoading - 是否显示全局loading，默认为 false
   */
  const verifyEmail = useCallback(
    async (email: string, withGlobalLoading?: boolean): Promise<EmailVerifyResult> => {
      const defaultResult: EmailVerifyResult = {
        userExists: false,
        existingUsername: '',
        existingPhone: '',
        userType: '',
      };

      // 根据参数决定是否显示 loading
      if (withGlobalLoading) {
        showLoading();
      }

      try {
        const response = await organizationApi.verifyEmail({ email: email || '' });
        const result: EmailVerifyResult = {
          userExists: response.data.exists || false,
          existingUsername: response.data.username || '',
          existingPhone: response.data.phone || '',
          userType: response.data.userType || '',
        };

        setUserExists(result.userExists || false);
        setExistingUsername(result.existingUsername || '');
        setExistingPhone(result.existingPhone || '');
        setUserType(result.userType || '');
        return result;
      } catch (error) {
        setUserExists(false);
        setExistingUsername('');
        setExistingPhone('');
        return defaultResult;
      } finally {
        // 只在开启了 loading 的情况下关闭
        if (withGlobalLoading) {
          hideLoading();
        }
      }
    },
    [showLoading, hideLoading],
  );

  /**
   * 验证组织信息
   */
  const verifyOrganization = useCallback(
    async (values: OrganizationFormData) => {
      const defaultResult: VerifyOrganization = {
        isOrganizationExists: false,
        isOrganizationSimilar: false,
        isPhoneExists: false,
        isScope: false,
        timestamp: Date.now(),
      };

      try {
        const verifyParams: CreateOrganizationRequest = requestParams(values);

        const response = await organizationApi.verify(verifyParams);
        const result = { ...response.data, timestamp: Date.now() };
        setVerifyResult(result);
        return result;
      } catch (error) {
        setVerifyResult(defaultResult);
        return defaultResult;
      }
    },
    [currentParentNode],
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
    [currentParentNode],
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
    [currentParentNode],
  );

  /**
   * 提交表单 - 核心业务逻辑
   */
  const handleSubmit = useCallback(
    async (values: OrganizationFormData, onRefresh?: () => void) => {
      // 开始全局 loading
      showLoading();

      try {
        // ===== 第一步：验证组织信息 =====
        const verifyData = await verifyOrganization(values);

        // 如果验证失败，直接返回
        if (
          verifyData?.isOrganizationExists ||
          verifyData?.isOrganizationSimilar ||
          verifyData?.isPhoneExists ||
          verifyData?.isScope
        ) {
          return { success: false, reason: 'validation_failed', verifyData };
        }

        // ===== 第二步：验证邮箱 =====
        const emailResult = await verifyEmail(values.orgEmail);

        // ===== 第三步：创建组织 =====
        let response;

        // 关键判断：只有当 userExists 为 true 时才使用已存在用户

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
          success({
            title: 'Success !',
            content: t('org.toast.create_success'),
            onOk: () => {
              onRefresh?.();
            },
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
        hideLoading();
      }
    },
    [
      showLoading,
      hideLoading,
      verifyOrganization,
      verifyEmail,
      handleConfirmWithExistingUser,
      handleCreateOrganization,
      success,
      t,
      currentParentNode,
    ],
  );

  /**
   * 刷新组织列表
   */
  const refreshOrganizationList = useCallback(async () => {
    await loadOrganizationData({
      withLoading,
    });
  }, [withLoading]);

  /**
   * 重置验证状态
   */
  const resetVerifyStatus = useCallback(() => {
    setUserExists(false);
    setExistingUsername('');
    setExistingPhone('');
    setVerifyResult({
      isOrganizationExists: false,
      isOrganizationSimilar: false,
      isPhoneExists: false,
      isScope: false,
      timestamp: 0,
    });
  }, []);

  return {
    // 状态
    userExists,
    existingUsername,
    existingPhone,
    userType,
    verifyResult,

    // 方法
    verifyEmail,
    verifyOrganization,
    handleSubmit,
    refreshOrganizationList,
    resetVerifyStatus,
  };
};
