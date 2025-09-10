// src/features/converter/JsonToCsvConverter.tsx
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
import FileSaver from 'file-saver'
import React, { useCallback, useState } from 'react'

const JsonToCsv: React.FC = () => {
  const [output, setOutput] = useState('')
  const clipboard = useClipboard({ timeout: 1000 })
  const form = useForm({
    initialValues: {
      input: '',
    },
  })

  const handleSubmit = useCallback((values: { input: string }) => {
    onActionMellowtel(() => {
      try {
        const data = JSON.parse(values.input)
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Input must be a non-empty array of objects.')
        }

        const headers = Object.keys(data[0])
        const csvRows = [headers.join(',')]

        for (const row of data) {
          const values = headers.map((header) => {
            const escaped = ('' + row[header]).replace(/"/g, '""')
            return `"${escaped}"`
          })
          csvRows.push(values.join(','))
        }

        setOutput(csvRows.join('\n'))
      } catch (error: any) {
        setOutput(`Error: ${error.message}`)
      }
    })
  }, [])

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/csv;charset=utf-8' })
    FileSaver.saveAs(blob, 'converted.csv')
  }

  const handleClear = useCallback(() => {
    form.reset()
    setOutput('')
  }, [form])

  return (
    <LayoutTool width={1000}>
      <Stack>
        <Title order={4} ta="center">
          JSON to CSV Converter
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Convert an array of JSON objects into comma-separated values.
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Textarea
                  label="Input JSON"
                  placeholder='[{"name":"John","age":30},{"name":"Jane","age":28}]'
                  autosize
                  minRows={12}
                  styles={{ input: { fontFamily: 'monospace' } }}
                  {...form.getInputProps('input')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Textarea
                  label="Output CSV"
                  readOnly
                  autosize
                  minRows={12}
                  value={output}
                  styles={{ input: { fontFamily: 'monospace' } }}
                />
              </Grid.Col>
            </Grid>
            <Card withBorder>
              <Group justify="space-between">
                <Button type="submit">Convert to CSV</Button>
                <Group>
                  <Tooltip label="Download .csv">
                    <ActionIcon
                      variant="light"
                      size="lg"
                      onClick={handleDownload}
                      disabled={!output || output.startsWith('Error')}
                    >
                      <Icon icon="tabler:download" />
                    </ActionIcon>
                  </Tooltip>
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

export default JsonToCsv
