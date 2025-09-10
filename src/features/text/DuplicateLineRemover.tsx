// src/features/text/DuplicateLineRemover.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import { onActionMellowtel } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  Grid,
  Group,
  Stack,
  Text,
  Textarea,
  Title,
  Tooltip,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useClipboard } from '@mantine/hooks'
import React, { useCallback, useState } from 'react'

const DuplicateLineRemover: React.FC = () => {
  const [output, setOutput] = useState('')
  const [linesRemoved, setLinesRemoved] = useState(0)
  const clipboard = useClipboard({ timeout: 1000 })
  const form = useForm({
    initialValues: {
      input: '',
    },
  })

  const handleSubmit = useCallback((values: { input: string }) => {
    onActionMellowtel(() => {
      const lines = values.input.split(/\r?\n/)
      const uniqueLines = [...new Set(lines)]
      const result = uniqueLines.join('\n')

      setOutput(result)
      setLinesRemoved(lines.length - uniqueLines.length)
    })
  }, [])

  const handleClear = useCallback(() => {
    form.reset()
    setOutput('')
    setLinesRemoved(0)
  }, [form])

  return (
    <LayoutTool width={1000}>
      <Stack>
        <Title order={4} ta="center">
          Duplicate Line Remover
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Paste your text to quickly remove any duplicate lines.
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Textarea
                  label="Input Text"
                  placeholder="Paste text with duplicate lines here..."
                  autosize
                  minRows={12}
                  {...form.getInputProps('input')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Textarea
                  label="Unique Lines"
                  readOnly
                  autosize
                  minRows={12}
                  value={output}
                />
              </Grid.Col>
            </Grid>
            <Card withBorder>
              <Group justify="space-between">
                <Button type="submit">Remove Duplicates</Button>
                {linesRemoved > 0 && (
                  <Text c="teal" size="sm">
                    {linesRemoved} duplicate line(s) removed.
                  </Text>
                )}
                <Group>
                  <Tooltip label="Copy">
                    <ActionIcon
                      variant="light"
                      size="lg"
                      onClick={() => clipboard.copy(output)}
                      disabled={!output}
                    >
                      <Icon
                        icon={clipboard.copied ? 'tabler:check' : 'tabler:copy'}
                      />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Clear">
                    <ActionIcon
                      variant="light"
                      color="red"
                      size="lg"
                      onClick={handleClear}
                    >
                      <Icon icon="tabler:clear-all" />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
            </Card>
          </Stack>
        </form>
      </Stack>
    </LayoutTool>
  )
}

export default DuplicateLineRemover
