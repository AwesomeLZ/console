import { Flex, Grid, Text } from '@chakra-ui/react';

import {
  Loading,
  PageHeaderToolbar,
  Pagination,
} from '@tkeel/console-components';
import { usePagination } from '@tkeel/console-hooks';
import { EmptyFileIcon } from '@tkeel/console-icons';
import { plugin } from '@tkeel/console-utils';

import MoreActionButton from '@/tkeel-console-plugin-tenant-routing-rules/components/MoreActionButton';
import RouteLabel from '@/tkeel-console-plugin-tenant-routing-rules/components/RouteLabel';
import useRouteRulesQuery from '@/tkeel-console-plugin-tenant-routing-rules/hooks/queries/useRouteRulesQuery';
import CreateRulesButton from '@/tkeel-console-plugin-tenant-routing-rules/pages/Index/components/CreateRulesButton';
import RouteRulesCard from '@/tkeel-console-plugin-tenant-routing-rules/pages/Index/components/RouteRulesCard';
import Step from '@/tkeel-console-plugin-tenant-routing-rules/pages/Index/components/Step';

export default function Index(): JSX.Element {
  const pagination = usePagination();
  const { pageNum, pageSize, setTotalSize } = pagination;
  const toast = plugin.getPortalToast();
  const routeTypeArr = ['msg', 'time'];
  const { routeRulesData, data, isSuccess, isLoading, refetch } =
    useRouteRulesQuery({
      pageNum,
      pageSize,
    });
  const totalNum = data?.total ?? 0;
  if (isSuccess) {
    setTotalSize(totalNum);
  }

  const handleCreateUserSuccess = () => {
    toast('创建成功', { status: 'success' });
    refetch();
  };

  return (
    <Flex flexDirection="column" h="100%">
      <PageHeaderToolbar
        name="数据路由规则"
        hasIcon
        buttons={[
          <CreateRulesButton
            key="create"
            type="createButton"
            onSuccess={handleCreateUserSuccess}
          />,
        ]}
      />
      {isLoading ? (
        <Loading styles={{ wrapper: { height: '100%' } }} />
      ) : (
        <Flex
          flexDirection="column"
          flex="1"
          overflow="hidden"
          paddingTop="14px"
          backgroundColor="gray.50"
        >
          {routeRulesData.length === 0 ? (
            <Flex
              h="100%"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <EmptyFileIcon size={80} />
              <Text fontSize="14px" lineHeight="24px" color="gray.700">
                请
                <CreateRulesButton
                  key="create"
                  type="createText"
                  onSuccess={handleCreateUserSuccess}
                />
                数据路由规则
              </Text>
            </Flex>
          ) : (
            <Flex
              flexDirection="column"
              justifyContent="space-between"
              flex="1"
              overflow="hidden"
            >
              <Grid
                templateColumns="repeat(2, 1fr)"
                gap="20px"
                padding="12px 20px"
              >
                {routeRulesData.map((rule) => {
                  const {
                    id,
                    name,
                    desc,
                    status,
                    type,
                    devices_status: deviceStatus,
                    targets_status: targetStatus,
                    sub_id: errorOperation,
                  } = rule;
                  const currentStep = [
                    deviceStatus,
                    targetStatus,
                    errorOperation,
                  ];
                  return (
                    <RouteRulesCard
                      key={id}
                      briefInfo={{ name, desc, status }}
                      operatorButton={
                        <MoreActionButton
                          cruxData={{ id, name, status, desc, type }}
                          refetch={() => {
                            refetch();
                          }}
                        />
                      }
                      bottomInfo={
                        <Flex>
                          <RouteLabel routeType={routeTypeArr[type - 1]} />
                          <Step currentStep={currentStep} />
                        </Flex>
                      }
                      onClick={() => {}}
                    />
                  );
                })}
              </Grid>
              <Pagination
                {...pagination}
                styles={{ wrapper: { padding: '0 20px' } }}
              />
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  );
}
