import { Flex, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function PreviewPanel({ children }: Props) {
  return (
    <>
      <Text color="gray.800" fontSize="14px" fontWeight="600" lineHeight="32px">
        效果预览
      </Text>
      <Flex
        marginTop="12px"
        width="100%"
        height="100%"
        backgroundColor="gray.100"
      >
        {children}
      </Flex>
    </>
  );
}
