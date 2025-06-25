import React from 'react';
import {
  Modal,
  TextInput,
  Textarea,
  Select,
  Group,
  Button,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Project } from '../types';

interface ProjectFormModalProps {
  opened: boolean;
  onClose: () => void;
  project?: Project | null;
  onSubmit: (values: Pick<Project, 'title' | 'description' | 'status' | 'tags'>) => void;
}

export function ProjectFormModal({ opened, onClose, project, onSubmit }: ProjectFormModalProps) {
  const form = useForm<{ title: string; description: string; status: string; tags: string }>({
    initialValues: {
      title: '',
      description: '',
      status: 'PILOT',
      tags: '',
    },
    validate: {
      title: (v) => (v ? null : 'Title is required'),
      description: (v) => (v ? null : 'Description is required'),
    },
  });

  // Reset form when modal opens/closes or project changes
  React.useEffect(() => {
    if (opened) {
      if (project) {
        form.setValues({
          title: project.title,
          description: project.description,
          status: project.status,
          tags: project.tags.join(', '),
        });
      } else {
        form.reset();
      }
    }
  }, [opened, project]);

  const handleSubmit = (values: typeof form.values) => {
    const tags = values.tags.split(',').map(t => t.trim()).filter(Boolean);
    onSubmit({
      ...values,
      status: values.status as Project['status'],
      tags,
    });
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={project ? 'Edit Project' : 'New Project'}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Title" {...form.getInputProps('title')} required />
        <Textarea
          label="Description"
          mt="sm"
          {...form.getInputProps('description')}
          required
        />
        <Select
          label="Status"
          mt="sm"
          data={['PILOT', 'ACTIVE', 'RETIRED', 'MAINTENANCE']}
          {...form.getInputProps('status')}
        />
        <TextInput
          label="Tags (comma separated)"
          mt="sm"
          {...form.getInputProps('tags')}
        />
        <Group justify="flex-start" mt="md">
          <Button type="submit">
            {project ? 'Update' : 'Create'}
          </Button>
        </Group>
      </form>
    </Modal>
  );
} 