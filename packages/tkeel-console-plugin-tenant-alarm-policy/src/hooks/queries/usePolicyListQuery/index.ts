import { useQuery } from '@tkeel/console-hooks';
import {
  AlarmLevel,
  AlarmRuleType,
  AlarmType,
  RuleStatus,
} from '@tkeel/console-types';

export interface Policy {
  ruleId: number;
  alarmLevel: AlarmLevel; // 告警级别：1 2 3 4; 1级最高，4级最低
  alarmRuleType: AlarmRuleType; // 0：阈值告警；1：系统告警
  ruleName: string;
  alarmSourceObject: string;
  ruleDesc: string;
  alarmType: AlarmType; // 0：基础告警；1：持续告警
  deviceId?: string;
  deviceName?: string;
  noticeId: string;
  enable: RuleStatus; // 0：停用；1：启用
}

interface ApiData {
  '@type': string;
  total: number;
  list: Policy[];
}

export interface Props {
  alarmRuleType?: AlarmRuleType;
  alarmLevel?: AlarmLevel;
  alarmType?: AlarmType;
  ruleName?: string;
  pageNum: number;
  pageSize: number;
}

export default function usePolicyListQuery({
  alarmLevel,
  alarmRuleType,
  alarmType,
  pageNum,
  pageSize,
}: Props) {
  const { data, ...rest } = useQuery<ApiData, Props>({
    url: '/tkeel-alarm/v1/rule/query',
    method: 'GET',
    params: {
      alarmLevel,
      alarmRuleType,
      alarmType,
      pageNum,
      pageSize,
    },
  });
  const policyList = data?.list || [];
  const total = data?.total || 0;

  return { policyList, total, ...rest };
}
