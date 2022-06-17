import { Flex, StyleProps, Text } from '@chakra-ui/react';
import { useState } from 'react';

import { DeviceTemplateList } from '@tkeel/console-business-components';
import type { FilterConditionInfo } from '@tkeel/console-components';
import { FilterConditionTag } from '@tkeel/console-components';
import { ChevronDownFilledIcon } from '@tkeel/console-icons';
import {
  useDeviceListQuery,
  useTemplatesQuery,
} from '@tkeel/console-request-hooks';

import TemplateDeviceList from '../TemplateDeviceList';

interface Props {
  value: string;
  onChange: (deviceInfo: string) => void;
  styles?: {
    wrapper?: StyleProps;
  };
}

interface DeviceInfo {
  tempId: string;
  tempName: string;
  deviceId: string;
  deviceName: string;
}

export const getDeviceInfo = (deviceInfo: string) => {
  return (
    deviceInfo
      ? JSON.parse(deviceInfo)
      : { tempId: '', tempName: '', deviceId: '', deviceName: '' }
  ) as DeviceInfo;
};

export default function DeviceSelectField({ value, onChange, styles }: Props) {
  const { tempId, tempName, deviceId, deviceName } = getDeviceInfo(value);
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [templateId, setTemplateId] = useState(tempId);
  const defaultTemplateCondition =
    tempId && tempName
      ? {
          id: tempId,
          label: '设备模板',
          value: tempName,
        }
      : null;

  const defaultDeviceCondition =
    deviceId && deviceName
      ? {
          id: deviceId,
          label: '',
          value: deviceName,
        }
      : null;

  const [templateCondition, setTemplateCondition] =
    useState<FilterConditionInfo | null>(defaultTemplateCondition);
  const [deviceCondition, setDeviceCondition] =
    useState<FilterConditionInfo | null>(defaultDeviceCondition);

  const { templates, isLoading: isTemplatesLoading } = useTemplatesQuery();
  const { deviceList, isLoading: isDeviceListLoading } = useDeviceListQuery({
    requestData: {
      condition: [
        {
          field: 'basicInfo.templateId',
          operator: '$wildcard',
          value: templateId,
        },
      ],
    },
    enabled: !!templateId,
  });

  let timer: number | null = null;
  // const handleDocumentClick = () => {
  //   setIsShowDropdown(false);
  // };

  // useEffect(() => {
  //   window.addEventListener('click', handleDocumentClick);

  //   return () => {
  //     window.removeEventListener('click', handleDocumentClick);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const handleMouseLeave = () => {
    timer = window.setTimeout(() => {
      setIsShowDropdown(false);
    }, 500);
  };

  const handleDropdownMouseEnter = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const filterConditionTagStyles = {
    value: {
      maxWidth: '70px',
      noOfLines: 1,
    },
  };

  return (
    <Flex
      height="40px"
      position="relative"
      alignItems="flex-end"
      onMouseLeave={handleMouseLeave}
      {...styles?.wrapper}
    >
      <Flex
        width="100%"
        padding="0 16px"
        justifyContent="space-between"
        alignItems="center"
        height="40px"
        borderWidth="1px"
        borderStyle="solid"
        borderColor={isShowDropdown ? 'primary' : 'grayAlternatives.50'}
        borderRadius="4px"
        cursor="pointer"
        onClick={(e) => {
          e.stopPropagation();
          setIsShowDropdown(!isShowDropdown);
        }}
      >
        <Flex alignItems="center" onClick={(e) => e.stopPropagation()}>
          {templateCondition && (
            <FilterConditionTag
              condition={templateCondition}
              removeCondition={() => {
                setTemplateId('');
                setTemplateCondition(null);
                onChange('{}');
                setDeviceCondition(null);
              }}
              styles={filterConditionTagStyles}
            />
          )}
          {deviceCondition && (
            <FilterConditionTag
              condition={deviceCondition}
              removeCondition={() => {
                setDeviceCondition(null);
              }}
              styles={filterConditionTagStyles}
            />
          )}
        </Flex>
        <ChevronDownFilledIcon />
      </Flex>
      {isShowDropdown && (
        <Flex
          position="absolute"
          left="0"
          top="44px"
          zIndex="1"
          width="100%"
          height="200px"
          overflowY="auto"
          padding="16px"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="gray.200"
          borderRadius="4px"
          backgroundColor="white"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={handleDropdownMouseEnter}
        >
          {templateId ? (
            <TemplateDeviceList
              isLoading={isDeviceListLoading}
              devices={deviceList}
              onBackBtnClick={() => setTemplateId('')}
              onClick={({ id, name }) => {
                onChange(
                  JSON.stringify({
                    tempId: templateCondition?.id ?? '',
                    tempName: templateCondition?.value ?? '',
                    deviceId: id,
                    deviceName: name,
                  })
                );
                setDeviceCondition({
                  id,
                  label: '',
                  value: name,
                });
                setIsShowDropdown(false);
              }}
            />
          ) : (
            <DeviceTemplateList
              isLoading={isTemplatesLoading}
              templates={templates}
              emptyTitle={
                <Flex flexDirection="column" alignItems="center">
                  <Text>暂无模板，请前往</Text>
                  <Text>设备模板添加</Text>
                </Flex>
              }
              onClick={({ id, name }) => {
                setTemplateId(id);
                setTemplateCondition({
                  id,
                  label: '设备模板',
                  value: name,
                });
                if (templateId && id !== templateId) {
                  setDeviceCondition(null);
                }
              }}
            />
          )}
        </Flex>
      )}
    </Flex>
  );
}