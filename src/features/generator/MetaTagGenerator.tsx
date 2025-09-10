// src/features/generator/MetaTagGenerator.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import { onActionMellowtel } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  Code,
  CopyButton,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useCallback, useState } from 'react'

const MetaTagGenerator: React.FC = () => {
  const [output, setOutput] = useState('')
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      keywords: '',
      author: '',
      viewport: 'width=device-width, initial-scale=1.0',
      charset: 'UTF-8',
    },
  })

  const handleSubmit = useCallback((values: typeof form.values) => {
    onActionMellowtel(() => {
      const tags = []
      if (values.charset) {
        tags.push(`<meta charset="${values.charset}">`)
      }
      if (values.viewport) {
        tags.push(`<meta name="viewport" content="${values.viewport}">`)
      }
      if (values.title) {
        tags.push(`<title>${values.title}</title>`)
      }
      if (values.description) {
        tags.push(`<meta name="description" content="${values.description}">`)
      }
      if (values.keywords) {
        tags.push(`<meta name="keywords" content="${values.keywords}">`)
      }
      if (values.author) {
        tags.push(`<meta name="author" content="${values.author}">`)
      }
      setOutput(tags.join('\n'))
    })
  }, [])

  const handleClear = useCallback(() => {
    form.reset()
    setOutput('')
  }, [form])

  return (
    <LayoutTool>
      <Stack>
        <Title order={4} ta="center">
          Meta Tag Generator
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Create SEO-friendly meta tags for your website to improve search
          engine visibility.
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Card withBorder p="xl" radius="md">
            <Stack>
              <TextInput
                label="Title"
                placeholder="Your Website Title"
                {...form.getInputProps('title')}
              />
              <Textarea
                label="Description"
                placeholder="A brief description of your page."
                autosize
                minRows={2}
                {...form.getInputProps('description')}
              />
              <TextInput
                label="Keywords"
                placeholder="e.g., keyword1, keyword2, keyword3"
                description="Comma-separated keywords related to your content."
                {...form.getInputProps('keywords')}
              />
              <TextInput
                label="Author"
                placeholder="John Doe"
                {...form.getInputProps('author')}
              />
              <Group grow>
                <TextInput
                  label="Viewport"
                  {...form.getInputProps('viewport')}
                />
                <TextInput
                  label="Character Set"
                  {...form.getInputProps('charset')}
                />
              </Group>
              <Button type="submit" mt="md">
                Generate Meta Tags
              </Button>
            </Stack>
          </Card>
        </form>

        {output && (
          <Card withBorder mt="lg">
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Generated HTML</Text>
              <div>
                <CopyButton value={output}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied!' : 'Copy Result'}>
                      <ActionIcon onClick={copy} disabled={!output}>
                        <Icon icon={copied ? 'tabler:check' : 'tabler:copy'} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
                <Tooltip label="Clear Input & Output">
                  <ActionIcon onClick={handleClear} color="red" ml="sm">
                    <Icon icon="tabler:clear-all" />
                  </ActionIcon>
                </Tooltip>
              </div>
            </Group>
            <Code block>{output}</Code>
          </Card>
        )}
      </Stack>
    </LayoutTool>
  )
}

export default MetaTagGenerator
