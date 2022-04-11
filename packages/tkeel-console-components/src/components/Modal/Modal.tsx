import {
  Button,
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  StyleProps,
} from '@chakra-ui/react';
import { noop } from 'lodash';
import { ReactNode } from 'react';

import ButtonsHStack from '@/tkeel-console-components/components/ButtonsHStack';

import ModalCloseButton from './ModalCloseButton';

type Props = {
  isOpen: boolean;
  width?: string | number;
  height?: string | number;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  hasCloseButton?: boolean;
  hasCancelButton?: boolean;
  hasConfirmButton?: boolean;
  isConfirmButtonDisabled?: boolean;
  isConfirmButtonLoading?: boolean;
  modalBodyStyle?: StyleProps;
  onClose: () => unknown;
  onCancel?: () => unknown;
  onConfirm?: (arg: unknown) => unknown;
};

const modalFooterProps = {
  padding: '0 20px',
  height: '60px',
  borderBottomLeftRadius: '4px',
  borderBottomRightRadius: '4px',
  backgroundColor: 'gray.50',
};

export default function Modal({
  isOpen,
  width = '600px',
  height = 'auto',
  title,
  children,
  footer = null,
  hasCloseButton = true,
  hasCancelButton = true,
  hasConfirmButton = true,
  isConfirmButtonDisabled = false,
  isConfirmButtonLoading = false,
  modalBodyStyle = {},
  onClose,
  onCancel = onClose,
  onConfirm = noop,
}: Props) {
  const renderFooter = () => {
    if (footer) {
      return <ModalFooter {...modalFooterProps}>{footer}</ModalFooter>;
    }

    if (hasCancelButton || hasConfirmButton) {
      return (
        <ModalFooter {...modalFooterProps}>
          <ButtonsHStack>
            {hasCancelButton && <Button onClick={onCancel}>取消</Button>}
            {hasConfirmButton && (
              <Button
                isDisabled={isConfirmButtonDisabled}
                isLoading={isConfirmButtonLoading}
                colorScheme="primary"
                onClick={onConfirm}
              >
                确定
              </Button>
            )}
          </ButtonsHStack>
        </ModalFooter>
      );
    }

    return null;
  };

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent
        width={width}
        height={height}
        maxWidth="unset"
        borderRadius="4px"
        boxShadow="0px 4px 8px rgba(36, 46, 66, 0.06)"
        css={`
          .chakra-icon {
            width: 9px;
            height: 9px;
          }
        `}
      >
        {title && (
          <ModalHeader
            display="flex"
            alignItems="center"
            flexBasis="50px"
            padding="0 20px"
            borderBottomWidth="1px"
            borderBottomStyle="solid"
            borderBottomColor="gray.200"
            fontSize="14px"
            fontWeight="500"
            lineHeight="24px"
            color="gray.800"
            borderTopLeftRadius="4px"
            borderTopRightRadius="4px"
            backgroundColor="gray.50"
          >
            {title}
          </ModalHeader>
        )}
        {hasCloseButton && <ModalCloseButton top="9px" right="20px" />}
        <ModalBody padding="20px 40px" {...modalBodyStyle}>
          {children}
        </ModalBody>
        {renderFooter()}
      </ModalContent>
    </ChakraModal>
  );
}
