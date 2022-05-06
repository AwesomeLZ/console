import { Box, Flex, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { NetworkIcon } from '@tkeel/console-icons';

import StatusLabel from '../../../../components/StatusLabel';

type Props = {
  briefInfo: {
    name: string;
    status: number;
  };
  operatorButton: ReactNode;
  bottomInfo: ReactNode;
  onClick: () => unknown;
};

function NetWorkCard({
  briefInfo,
  operatorButton,
  bottomInfo,
  onClick,
}: Props) {
  return (
    <Flex
      position="relative"
      flexDirection="column"
      justifyContent="space-between"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="gray.200"
      borderRadius="4px"
      backgroundColor="white"
      cursor="pointer"
      _hover={{
        boxShadow: '0px 4px 8px rgba(113, 128, 150, 0.1)',
      }}
      onClick={onClick}
    >
      <Box
        bgColor="gray.50"
        borderTopLeftRadius="4px"
        borderTopRightRadius="4px"
        padding="16px 16px 12px 24px"
        h="56px"
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <Box flexShrink={0}>
              <NetworkIcon size={26} />
            </Box>
            <Text
              marginLeft="10px"
              color="gray.800"
              fontSize="14px"
              fontWeight="600"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              overflow="hidden"
              maxWidth="126px"
              title={briefInfo?.name}
            >
              {briefInfo?.name}
            </Text>
          </Flex>
          <StatusLabel
            styles={{ wrapper: { ml: '10px' } }}
            status={briefInfo.status}
          />
          {operatorButton}
        </Flex>
      </Box>
      <Box padding="16px 24px">{bottomInfo}</Box>
    </Flex>
  );
}

export default NetWorkCard;
