import { type SetStateAction, useCallback, useEffect, useState } from 'react';
import type { Member } from '@pages/organization/dto';
import { loadMembers } from '@pages/organization/services/organizationService';
import type { SegmentedValue } from 'antd/es/segmented';

/**
 * useMemberList Hook 参数接口
 */
interface UseMemberListParams {
  /** 组织ID，用于查询成员列表 */
  orgId: string;
}

/**
 * useMemberList Hook 返回值接口
 */
interface UseMemberListReturn {
  /** 加载状态 */
  loading: boolean;
  /** 成员列表数据 */
  members: Member[];
  /** 总记录数 */
  total: number;
  /** 当前页码 */
  current: number;
  /** 每页大小 */
  pageSize: number;
  /** 当前筛选状态 */
  status: string;
  /** 搜索关键词 */
  keyword: string;
  /** 状态变更处理函数 */
  handleStatusChange: (value: SegmentedValue) => void;
  /** 关键词变更处理函数 */
  handleKeywordChange: (keyword: string) => void;
  /** 搜索处理函数 */
  handleSearch: () => void;
  /** 重置处理函数 */
  handleReset: () => void;
  /** 表格变更处理函数 */
  handleTableChange: (pagination: any, sorter: any) => void;
  /** 加载成员数据函数 */
  loadMembersData: () => Promise<void>;
}

/**
 * useMemberList 自定义 Hook
 * 用于管理成员列表的状态和数据加载逻辑
 *
 * @param params - Hook 参数，包含组织ID
 * @returns 成员列表相关的状态和操作函数
 */
export const useMemberList = ({ orgId }: UseMemberListParams): UseMemberListReturn => {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState<string>('');
  const [keyword, setKeyword] = useState('');

  /**
   * 加载成员数据
   * 根据当前的分页、筛选、排序等条件加载成员列表
   */
  const loadMembersData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await loadMembers({
        pageNum: current,
        pageSize,
        keyword,
        status,
        orgId,
      });
      if (response) {
        setMembers(response.data.records);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  }, [current, pageSize, keyword, status, orgId]);

  /**
   * 当依赖项变化时自动加载成员数据
   */
  useEffect(() => {
    loadMembersData();
  }, [loadMembersData]);

  /**
   * 处理状态筛选变更
   * @param value - 新的状态值
   */
  const handleStatusChange = useCallback((value: SegmentedValue) => {
    setStatus(value as string);
    setCurrent(1); // 重置页码到第一页
  }, []);

  /**
   * 处理关键词变更
   * @param newKeyword - 新的关键词值
   */
  const handleKeywordChange = useCallback((newKeyword: string) => {
    setKeyword(newKeyword);
    setCurrent(1); // 重置页码到第一页
  }, []);

  /**
   * 处理搜索操作
   * 触发搜索并重置页码到第一页
   */
  const handleSearch = useCallback(() => {
    setCurrent(1);
    loadMembersData();
  }, [loadMembersData]);

  /**
   * 处理重置操作
   * 重置所有筛选条件和排序状态
   */
  const handleReset = useCallback(() => {
    setStatus('');
    setKeyword('');
    setCurrent(1);
    setPageSize(10);
  }, []);

  /**
   * 处理表格变更
   * @param pagination - 分页信息
   * @param sorter - 排序信息
   */
  const handleTableChange = useCallback(
    (pagination: { current: SetStateAction<number>; pageSize: SetStateAction<number> }) => {
      if (pagination.current) setCurrent(pagination.current);
      if (pagination.pageSize) setPageSize(pagination.pageSize);
    },
    [],
  );

  return {
    loading,
    members,
    total,
    current,
    pageSize,
    status,
    keyword,
    handleStatusChange,
    handleKeywordChange,
    handleSearch,
    handleReset,
    handleTableChange,
    loadMembersData,
  };
};
