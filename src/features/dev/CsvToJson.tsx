// src/features/converter/CsvToJsonConverter.tsx
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
  Switch,
  Text,
  Textarea,
  Title,
  Tooltip,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useClipboard } from '@mantine/hooks'
import React, { useCallback, useState } from 'react'

const CsvToJsonConverter: React.FC = () => {
  const [output, setOutput] = useState('')
  const clipboard = useClipboard({ timeout: 1000 })
  const form = useForm({
    initialValues: {
      input: '',
      hasHeader: true,
    },
  })

  const handleSubmit = useCallback((values: typeof form.values) => {
    onActionMellowtel(() => {
      if (!values.input) {
        setOutput('')
        return
      }
      try {
        const lines = values.input.trim().split(/\r?\n/)
        if (lines.length === 0) {
          setOutput('[]')
          return
        }

        const headers = values.hasHeader
          ? lines.shift()!.split(',')
          : Array.from(
              { length: lines[0].split(',').length },
              (_, i) => `field${i + 1}`,
            )

        const jsonArray = lines.map((line) => {
          const values = line.split(',')
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim()
            return obj
          }, {})
        })

        setOutput(JSON.stringify(jsonArray, null, 2))
      } catch (error: any) {
        setOutput(`Error: ${error.message}`)
      }
    })
  }, [])

  const handleClear = useCallback(() => {
    form.reset()
    setOutput('')
  }, [form])

  return (
    <LayoutTool width={1000}>
      <Stack>
        <Title order={4} ta="center">
          CSV to JSON Converter
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Convert comma-separated values into a structured JSON format.
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Card withBorder>
              <Switch
                label="First row is header"
                {...form.getInputProps('hasHeader', { type: 'checkbox' })}
              />
            </Card>
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Textarea
                  label="Input CSV"
                  placeholder="name,email,age&#10;John Doe,john@test.com,30"
                  autosize
                  minRows={12}
                  styles={{ input: { fontFamily: 'monospace' } }}
                  {...form.getInputProps('input')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Textarea
                  label="Output JSON"
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
                <Button type="submit">Convert</Button>
                <Group>
                  <Tooltip label={clipboard.copied ? 'Copied!' : 'Copy'}>
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

export default CsvToJsonConverter
