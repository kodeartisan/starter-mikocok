// src/features/text/TextToSlugConverter.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import {
  Button,
  Card,
  CopyButton,
  Group,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useMemo } from 'react'

const TextToSlugConverter: React.FC = () => {
  const form = useForm({
    initialValues: {
      text: '',
      separator: '-',
      isLowercase: true,
    },
  })

  const generatedSlug = useMemo(() => {
    const { text, separator, isLowercase } = form.values
    if (!text) return ''

    const slug = isLowercase ? text.toLowerCase() : text

    return slug
      .toString()
      .normalize('NFD') // split an accented letter in the base letter and the acent
      .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
      .replace(/\s+/g, separator) // replace spaces with separator
      .replace(/[^\w-]+/g, '') // remove all non-word chars
      .replace(/--+/g, separator) // replace multiple separators with a single one
      .replace(/^-+/, '') // trim separator from start of text
      .replace(/-+$/, '') // trim separator from end of text
  }, [form.values])

  return (
    <LayoutTool>
      <Stack>
        <Title order={4} ta="center">
          Text to Slug Converter
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Create a clean, URL-friendly slug from any string of text.
        </Text>
        <Card withBorder p="xl" radius="md">
          <Stack>
            <TextInput
              label="Input Text"
              placeholder="Hello World! This is a test."
              {...form.getInputProps('text')}
            />
            <Group grow>
              <TextInput
                label="Separator"
                {...form.getInputProps('separator')}
              />
              <Switch
                mt="xl"
                label="Convert to lowercase"
                {...form.getInputProps('isLowercase', { type: 'checkbox' })}
              />
            </Group>
          </Stack>
        </Card>
        {generatedSlug && (
          <Card withBorder mt="lg">
            <Group justify="space-between">
              <Text fw={500}>Generated Slug</Text>
              <CopyButton value={generatedSlug}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied!' : 'Copy'}>
                    <Button
                      size="xs"
                      variant="light"
                      color={copied ? 'teal' : 'gray'}
                      onClick={copy}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
            <Text ff="monospace" mt="xs" p="xs" bg="gray.0">
              {generatedSlug}
            </Text>
          </Card>
        )}
      </Stack>
    </LayoutTool>
  )
}

export default TextToSlugConverter
