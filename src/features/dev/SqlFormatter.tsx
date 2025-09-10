// src/features/formatter/SqlFormatter.tsx
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

// Basic SQL Formatter
const formatSql = (sql: string): string => {
  const keywords = [
    'SELECT',
    'FROM',
    'WHERE',
    'GROUP BY',
    'ORDER BY',
    'LIMIT',
    'JOIN',
    'LEFT JOIN',
    'RIGHT JOIN',
    'INNER JOIN',
    'ON',
    'AND',
    'OR',
    'HAVING',
    'SET',
    'UPDATE',
    'INSERT INTO',
    'VALUES',
  ]
  const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi')
  let formatted = sql
    .replace(/\s+/g, ' ')
    .replace(regex, (match) => `\n${match}`)
  formatted = formatted.replace(/\s*,\s*/g, ',\n  ') // Indent columns
  if (formatted.startsWith('\n')) {
    formatted = formatted.substring(1)
  }
  return formatted
}

const SqlFormatter: React.FC = () => {
  const [output, setOutput] = useState('')
  const clipboard = useClipboard({ timeout: 1000 })
  const form = useForm({
    initialValues: {
      input: '',
    },
  })

  const handleSubmit = useCallback((values: { input: string }) => {
    onActionMellowtel(() => {
      if (!values.input) {
        setOutput('')
        return
      }
      try {
        const result = formatSql(values.input)
        setOutput(result)
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
          SQL Formatter
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Format and beautify your SQL queries to make them more readable.
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Textarea
                  label="Input SQL"
                  placeholder="Paste your SQL code here..."
                  autosize
                  minRows={12}
                  styles={{ input: { fontFamily: 'monospace' } }}
                  {...form.getInputProps('input')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Textarea
                  label="Formatted SQL"
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
                <Button type="submit">Format SQL</Button>
                <Group>
                  <Tooltip label={clipboard.copied ? 'Copied!' : 'Copy Output'}>
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
                      disabled={!form.values.input && !output}
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

export default SqlFormatter
