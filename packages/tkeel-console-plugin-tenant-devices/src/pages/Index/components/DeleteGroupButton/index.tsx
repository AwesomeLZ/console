import { Circle, useDisclosure } from '@chakra-ui/react';

import { Alert, MoreActionButton } from '@tkeel/console-components';
import { TrashFilledIcon } from '@tkeel/console-icons';
import { plugin } from '@tkeel/console-utils';

import useDeleteGroupMutation from '@/tkeel-console-plugin-tenant-devices/hooks/mutations/useDeleteGroupMutation';

interface Props {
  id: string;
  groupName: string;
  callback?: () => void;
}

function DeleteGroupButton({ id, groupName, callback }: Props) {
  const toast = plugin.getPortalToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ids = [id];
  const { mutate, isLoading } = useDeleteGroupMutation({
    ids,
    onSuccess(data) {
      onClose();
      if ((data?.data?.faildDelGroup ?? []).length > 0) {
        toast(`删除失败：${data?.data?.faildDelGroup[0]?.reason}`, {
          status: 'error',
        });
      } else {
        toast('删除设备组成功', { status: 'success' });
      }
      if (callback) {
        const timer = setTimeout(() => {
          callback();
          clearTimeout(timer);
        }, 800);
      }
    },
  });
  return (
    <>
      <MoreActionButton
        icon={<TrashFilledIcon size="12px" color="grayAlternatives.300" />}
        title="删除设备组"
        onClick={onOpen}
      />
      {isOpen && (
        <Alert
          iconPosition="left"
          icon={
            <Circle size="44px" backgroundColor="red.50">
              <TrashFilledIcon size="24px" color="red.300" />
            </Circle>
          }
          title={`确认删除设备组「${groupName}」？`}
          isOpen={isOpen}
          isConfirmButtonLoading={isLoading}
          onClose={onClose}
          onConfirm={() => {
            mutate({});
          }}
        />
      )}
    </>
  );
}

export default DeleteGroupButton;
