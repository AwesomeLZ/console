import { Flex, HStack, Text, useClipboard } from '@chakra-ui/react';
import { values } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { Cell, Column } from 'react-table';

import { MoreAction, Table } from '@tkeel/console-components';
import {
  ChainFilledIcon,
  DuotoneTwoToneIcon,
  SmartObjectTwoToneIcon,
} from '@tkeel/console-icons';

import { DeviceObject } from '@/tkeel-console-plugin-tenant-devices/hooks/queries/useDeviceDetailQuery/types';
import {
  AttributeRelationItem,
  ExpressionItem,
} from '@/tkeel-console-plugin-tenant-devices/pages/DeviceDetail/types';

import AddRelationButton from '../AddRelationButton';
import DeleteRelationButton from '../DeleteRelationButton';
import UpdateRelationButton from '../UpdateRelationButton';

function getNameByDescription({ description }: { description: string }) {
  if (description) {
    const [device, attribute] = description.split(',');
    const [deviceId, deviceName] = device.split('=');
    const [attributeId, attributeName] = attribute.split('=');
    return {
      deviceId,
      deviceName,
      attributeId,
      attributeName,
    };
  }
  return { deviceId: '', deviceName: '', attributeId: '', attributeName: '' };
}

interface Props {
  deviceObject: DeviceObject;
  attributeRelationList: ExpressionItem[];
  refetch?: () => void;
  keywords?: string;
}
export default function AttributeRelationTable({
  deviceObject,
  attributeRelationList,
  refetch = () => {},
  keywords = '',
}: Props) {
  const { configs, id: uid } = deviceObject;
  const [copiedValue, setCopiedValue] = useState('');
  const [copiedId, setCopiedId] = useState('');
  const attributeFields = configs?.attributes?.define?.fields ?? {};
  const { onCopy, hasCopied } = useClipboard(copiedValue, 200);
  const tableData = values(attributeFields)
    .filter((v) => v.id.includes(keywords) || v.name.includes(keywords))
    .map((item) => {
      const { id, name } = item;
      const relationItem = attributeRelationList.find(
        (v) => v.path === `attribute.${id}`
      );
      // const expression = relationItem?.expression ?? '';
      const description = relationItem?.description ?? '';
      const { deviceId, deviceName, attributeId, attributeName } =
        getNameByDescription({ description });

      return {
        id,
        name,
        deviceName,
        deviceId,
        attributeName,
        attributeId,
        icon: !!relationItem,
      };
    });
  useEffect(() => {
    if (copiedValue) {
      onCopy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copiedValue]);

  const handleCopy = useCallback(
    ({ value, id }: { value: string; id: string }) => {
      setCopiedValue(value);
      setCopiedId(id);
    },
    []
  );

  const OperateCell = useCallback(
    ({ row }: Cell<AttributeRelationItem>) => {
      const { original } = row;
      if (!original.deviceId) {
        return '';
      }
      return (
        <MoreAction
          buttons={[
            <UpdateRelationButton
              type="attribute"
              key="update"
              uid={uid}
              deviceObject={deviceObject}
              configInfo={original}
              refetch={refetch}
            />,
            <DeleteRelationButton
              type="attribute"
              key="delete"
              uid={uid}
              path={original?.id}
            />,
          ]}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refetch, uid]
  );
  const columns: ReadonlyArray<Column<AttributeRelationItem>> = [
    {
      Header: '属性名称',
      accessor: 'name',
      width: 160,
      Cell: useCallback(
        ({ value }) => (
          <Flex alignItems="center" justifyContent="space-between">
            <DuotoneTwoToneIcon />
            <Text
              color="gray.800"
              fontWeight="600"
              fontSize="12px"
              marginLeft="12px"
            >
              {value}
            </Text>
          </Flex>
        ),
        []
      ),
    },
    {
      Header: '属性ID',
      accessor: 'id',
      width: 100,
    },
    {
      Header: '',
      width: 60,
      accessor: 'icon',
      Cell: useCallback(({ value }) => {
        if (value) {
          return <ChainFilledIcon size="16px" />;
        }
        return '';
      }, []),
    },
    {
      Header: '关联设备',
      accessor: 'deviceName',
      width: 120,
      Cell: useCallback(
        ({ row }: Cell<AttributeRelationItem>) => {
          const { original } = row;
          const { deviceName } = original;
          if (deviceName) {
            return (
              <HStack spacing="6px">
                <SmartObjectTwoToneIcon size="16px" />
                <Text>{deviceName}</Text>
              </HStack>
            );
          }
          return (
            <AddRelationButton
              type="attribute"
              deviceObject={deviceObject}
              configInfo={original}
              refetch={refetch}
            />
          );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deviceObject]
      ),
    },
    {
      Header: '关联设备ID',
      // accessor: 'deviceId',
      width: 100,
      Cell: useCallback(
        ({ row }: Cell<AttributeRelationItem>) => {
          const { original, id } = row;
          const value = original.deviceId ?? '';
          if (hasCopied && id === copiedId && value === copiedValue) {
            return <Text color="primary">已复制</Text>;
          }
          return (
            <Text
              cursor="copy"
              w="100%"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              onClick={() => {
                handleCopy({ value, id });
              }}
            >
              {value}
            </Text>
          );
        },
        [copiedId, copiedValue, handleCopy, hasCopied]
      ),
    },
    {
      Header: '关联属性名称',
      accessor: 'attributeName',
      width: 120,
      Cell: useCallback(
        ({ value }) =>
          value ? (
            <HStack spacing="6px">
              <DuotoneTwoToneIcon size="16px" />
              <Text>{value}</Text>
            </HStack>
          ) : (
            ''
          ),
        []
      ),
    },
    {
      Header: '关联属性ID',
      // accessor: 'attributeId',
      width: 100,
      Cell: useCallback(
        ({ row }: Cell<AttributeRelationItem>) => {
          const { original, id } = row;
          const value = original.attributeId ?? '';
          if (hasCopied && id === copiedId && value === copiedValue) {
            return <Text color="primary">已复制</Text>;
          }
          return (
            <Text
              cursor="copy"
              w="100%"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              onClick={() => {
                handleCopy({ value, id });
              }}
            >
              {value}
            </Text>
          );
        },
        [copiedId, copiedValue, handleCopy, hasCopied]
      ),
    },
    {
      Header: '操作',
      width: 80,
      Cell: OperateCell,
    },
  ];
  return (
    <Table
      scroll={{ y: '100%' }}
      styles={{
        wrapper: {
          flex: 1,
          height: '100%',
          overflow: 'hidden',
          padding: '6px 12px 12px',
        },
        bodyTr: {
          borderRadius: '4px',
          fontSize: '12px',
          background: 'white',
          marginBottom: '4px',
          borderWidth: '1px',
          borderStyle: 'solid',
        },
        bodyTd: { height: '42px' },
        headTr: {
          borderBottom: 'none',
        },
      }}
      columns={columns}
      data={tableData}
      hasPagination={false}
    />
  );
}
