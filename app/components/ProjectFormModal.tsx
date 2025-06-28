import React from 'react';
import {
  Modal,
  TextInput,
  Textarea,
  Select,
  Group,
  Button,
  TagsInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Project } from '../types';

interface ProjectFormModalProps {
  opened: boolean;
  onClose: () => void;
  project?: Project | null;
  onSubmit: (values: Pick<Project, 'title' | 'description' | 'status' | 'tags' | 'whyWeBuiltThis' | 'whatWeveBuilt'>) => void;
}

export function ProjectFormModal({ opened, onClose, project, onSubmit }: ProjectFormModalProps) {
  const form = useForm<{ title: string; description: string; status: string; tags: string[]; whyWeBuiltThis: string; whatWeveBuilt: string }>({
    initialValues: {
      title: '',
      description: '',
      status: 'PILOT',
      tags: [],
      whyWeBuiltThis: '',
      whatWeveBuilt: '',
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
          tags: project.tags,
          whyWeBuiltThis: project.whyWeBuiltThis || '',
          whatWeveBuilt: project.whatWeveBuilt || '',
        });
      } else {
        form.reset();
      }
    }
  }, [opened, project]);

  const handleSubmit = (values: typeof form.values) => {
    onSubmit({
      ...values,
      status: values.status as Project['status'],
      tags: values.tags,
      whyWeBuiltThis: values.whyWeBuiltThis,
      whatWeveBuilt: values.whatWeveBuilt,
    });
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Add New Project'}
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
        <Textarea
          label="WHY WE BUILT THIS"
          mt="sm"
          {...form.getInputProps('whyWeBuiltThis')}
        />
        <Textarea
          label="WHAT WE'VE BUILT"
          mt="sm"
          {...form.getInputProps('whatWeveBuilt')}
        />
        <Select
          label="Status"
          mt="sm"
          data={['PILOT', 'ACTIVE', 'RETIRED', 'MAINTENANCE']}
          {...form.getInputProps('status')}
        />
        <TagsInput
          label="Tags"
          placeholder="Enter tags"
          mt="sm"
          value={form.values.tags}
          onChange={(tags) => form.setFieldValue('tags', tags)}
          data={[]}
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