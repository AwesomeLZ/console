import { Box, Flex, Text } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { CellProps, Column } from 'react-table';

import {
  AlarmLevelSelect,
  AlarmLevelTag,
  AlarmLevelTips,
  AlarmRuleTypeTag,
  AlarmTypeSelect,
} from '@tkeel/console-business-components';
import {
  MoreAction,
  PageHeaderToolbar,
  Table,
} from '@tkeel/console-components';
import { usePagination } from '@tkeel/console-hooks';
import { MailFilledIcon } from '@tkeel/console-icons';
import {
  AlarmLevel,
  AlarmRuleType,
  AlarmSourceObject,
  AlarmType,
  RuleStatus,
} from '@tkeel/console-types';

import DeletePolicyButton from '@/tkeel-console-plugin-tenant-alarm-policy/components/DeletePolicyButton';
import ModifyPolicyButton from '@/tkeel-console-plugin-tenant-alarm-policy/components/ModifyPolicyButton';
import {
  ALARM_SOURCE_OBJECT_MAP,
  ALARM_TYPE_MAP,
  RULE_STATUS_MAP,
} from '@/tkeel-console-plugin-tenant-alarm-policy/constants';
import type {
  Policy,
  RequestParams as usePolicyListQueryProps,
} from '@/tkeel-console-plugin-tenant-alarm-policy/hooks/queries/usePolicyListQuery';
import usePolicyListQuery from '@/tkeel-console-plugin-tenant-alarm-policy/hooks/queries/usePolicyListQuery';

import CreatePolicyButton from '../CreatePolicyButton';
import SwitchStatusButton from '../SwitchStatusButton';
import ViewPolicyDetailButton from '../ViewPolicyDetailButton';

interface Props {
  alarmRuleType?: AlarmRuleType;
}

export default function PolicyTable({ alarmRuleType }: Props) {
  const [keywords, setKeywords] = useState('');
  const [alarmLevel, setAlarmLevel] = useState<AlarmLevel>();
  const [alarmType, setAlarmType] = useState<AlarmType>();

  const pagination = usePagination();
  const { pageNum, pageSize, setPageNum, setTotalSize } = pagination;

  const params: usePolicyListQueryProps = {
    alarmRuleType,
    alarmLevel,
    alarmType,
    ruleName: keywords,
    pageNum,
    pageSize,
  };

  const { policyList, total, isLoading, isFetching, isSuccess, refetch } =
    usePolicyListQuery(params);
  if (isSuccess) {
    setTotalSize(total);
  }

  const columns: ReadonlyArray<Column<Policy>> = [
    {
      Header: (
        <Flex>
          <Text marginRight="2px">级别</Text>
          <AlarmLevelTips />
        </Flex>
      ),
      accessor: 'alarmLevel',
      Cell: useCallback(
        ({ value }: CellProps<Policy, AlarmLevel>) => (
          <AlarmLevelTag level={value} />
        ),
        []
      ),
    },
    {
      Header: '告警策略类型',
      accessor: 'alarmRuleType',
      Cell: useCallback(
        ({ value }: CellProps<Policy, AlarmRuleType>) => (
          <AlarmRuleTypeTag type={value} />
        ),
        []
      ),
    },
    {
      Header: '告警策略名称',
      accessor: 'ruleName',
    },
    {
      Header: '告警源对象',
      accessor: 'alarmSourceObject',
      Cell: useCallback(
        ({ value }: CellProps<Policy, AlarmSourceObject>) => (
          <Box>{ALARM_SOURCE_OBJECT_MAP[value] || ''}</Box>
        ),
        []
      ),
    },
    {
      Header: '规则描述',
      accessor: 'ruleDesc',
    },
    {
      Header: '告警类型',
      accessor: 'alarmType',
      Cell: useCallback(
        ({ value }: CellProps<Policy, AlarmType>) => (
          <Box>{ALARM_TYPE_MAP[value] || ''}</Box>
        ),
        []
      ),
    },
    {
      Header: '通知配置',
      Cell: useCallback(() => {
        return (
          <MailFilledIcon
            color="primary"
            style={{ marginLeft: '10px', cursor: 'pointer' }}
          />
        );
      }, []),
    },
    {
      Header: '状态',
      accessor: 'enable',
      Cell: useCallback(
        ({ value, row }: CellProps<Policy, RuleStatus>) => (
          <Flex alignItems="center">
            <SwitchStatusButton
              status={value}
              ruleId={row.original.ruleId}
              onSuccess={() => refetch()}
            />
            <Text marginLeft="8px" color="gray.700" fontSize="12px">
              {RULE_STATUS_MAP[value] || ''}
            </Text>
          </Flex>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
      ),
    },
    {
      Header: '操作',
      width: 80,
      Cell: useCallback(({ row }: CellProps<Policy>) => {
        const { original } = row;

        return (
          <MoreAction
            styles={{ actionList: { width: '124px' } }}
            buttons={[
              <ModifyPolicyButton
                key="modify"
                policy={original}
                onSuccess={() => refetch()}
              />,
              <ViewPolicyDetailButton
                policy={original}
                key="viewDetail"
                refetchData={() => refetch()}
              />,
              <DeletePolicyButton
                key="delete"
                policy={original}
                onSuccess={() => refetch()}
              />,
            ]}
          />
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []),
    },
  ];

  const isShowLoading = keywords ? isFetching : isLoading;
  return (
    <Flex height="100%" flexDirection="column">
      <PageHeaderToolbar
        name={
          <Flex>
            <AlarmLevelSelect
              onChange={(level) => {
                setAlarmLevel(level === -1 ? undefined : level);
              }}
            />
            <AlarmTypeSelect
              onChange={(type) => {
                setAlarmType(type === -1 ? undefined : type);
              }}
              styles={{ wrapper: { marginLeft: '12px' } }}
            />
          </Flex>
        }
        hasSearchInput
        searchInputProps={{
          placeholder: '支持搜索告警策略名称',
          inputGroupStyle: {
            flex: '1',
          },
          inputStyle: {
            backgroundColor: 'gray.50',
          },
          onSearch(value) {
            setPageNum(1);
            setKeywords(value);
          },
        }}
        hasRefreshIcon
        onRefresh={() => refetch()}
        buttons={[
          <CreatePolicyButton key="create" refetch={() => refetch()} />,
        ]}
        styles={{
          wrapper: {
            zIndex: 1,
            padding: '0 20px',
            backgroundColor: 'gray.100',
          },
        }}
      />
      <Table
        columns={columns}
        data={policyList}
        paginationProps={pagination}
        scroll={{ y: '100%' }}
        isLoading={isShowLoading}
        styles={{
          wrapper: {
            flex: 1,
            overflow: 'hidden',
            backgroundColor: 'whiteAlias',
          },
          headTr: {
            height: '40px',
            backgroundColor: 'gray.50',
          },
          pagination: {
            padding: '0 20px',
            backgroundColor: 'gray.50',
          },
        }}
      />
    </Flex>
  );
}