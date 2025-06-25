import React from 'react';
import {
  Modal,
  Text,
  Group,
  Button,
} from '@mantine/core';
import { Project } from '../types';

interface DeleteConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  project: Project | null;
  onConfirm: () => void;
}

export function DeleteConfirmationModal({ opened, onClose, project, onConfirm }: DeleteConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirm Delete"
      centered
    >
      <Text>
        Are you sure you want to delete "{project?.title}"? This action cannot be undone.
      </Text>
      <Group justify="flex-start" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button color="red" onClick={handleConfirm}>
          Delete
        </Button>
      </Group>
    </Modal>
  );
} 