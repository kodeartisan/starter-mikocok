// src/features/generator/UrlParser.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import { onActionMellowtel } from '@/utils/util'
import {
  Button,
  Card,
  CopyButton,
  Group,
  Stack,
  Table,
  Text,
  Textarea,
  Title,
  Tooltip,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useState } from 'react'

interface ParsedUrl {
  href: string
  protocol: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  origin: string
  searchParams: [string, string][]
}

const UrlParser: React.FC = () => {
  const [result, setResult] = useState<ParsedUrl | null>(null)
  const [error, setError] = useState<string>('')

  const form = useForm({
    initialValues: {
      url: '',
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    onActionMellowtel(() => {
      if (!values.url) {
        setResult(null)
        setError('')
        return
      }
      try {
        const parsed = new URL(values.url)
        setResult({
          href: parsed.href,
          protocol: parsed.protocol,
          hostname: parsed.hostname,
          port: parsed.port,
          pathname: parsed.pathname,
          search: parsed.search,
          hash: parsed.hash,
          origin: parsed.origin,
          searchParams: Array.from(parsed.searchParams.entries()),
        })
        setError('')
      } catch (e) {
        setResult(null)
        setError('Invalid URL provided. Please check the format.')
      }
    })
  }

  const handleClear = () => {
    form.reset()
    setResult(null)
    setError('')
  }

  const renderRow = (label: string, value: string) => {
    if (!value) return null
    return (
      <Table.Tr key={label}>
        <Table.Td>
          <Text fw={500}>{label}</Text>
        </Table.Td>
        <Table.Td>
          <Group justify="space-between">
            <Text ff="monospace">{value}</Text>
            <CopyButton value={value}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied' : 'Copy'}>
                  <Button size="xs" variant="subtle" onClick={copy} p={0}>
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
        </Table.Td>
      </Table.Tr>
    )
  }

  return (
    <LayoutTool>
      <Stack>
        <Title order={4} ta="center">
          URL Parser
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Enter a URL to break it down into its individual components.
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Card withBorder>
            <Textarea
              label="URL to Parse"
              placeholder="https://example.com:8080/path/to/page?query=value#section"
              autosize
              minRows={3}
              error={error}
              {...form.getInputProps('url')}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={handleClear}>
                Clear
              </Button>
              <Button type="submit">Parse URL</Button>
            </Group>
          </Card>
        </form>

        {result && (
          <Card withBorder mt="lg">
            <Title order={5} mb="md">
              Parsed URL Components
            </Title>
            <Table withTableBorder withColumnBorders>
              <Table.Tbody>
                {renderRow('Protocol', result.protocol)}
                {renderRow('Hostname', result.hostname)}
                {renderRow('Port', result.port)}
                {renderRow('Pathname', result.pathname)}
                {renderRow('Search', result.search)}
                {renderRow('Hash', result.hash)}
              </Table.Tbody>
            </Table>
            {result.searchParams.length > 0 && (
              <>
                <Title order={5} my="md">
                  Search Parameters
                </Title>
                <Table withTableBorder withColumnBorders>
                  <Table.Tbody>
                    {result.searchParams.map(([key, value]) =>
                      renderRow(key, value),
                    )}
                  </Table.Tbody>
                </Table>
              </>
            )}
          </Card>
        )}
      </Stack>
    </LayoutTool>
  )
}

export default UrlParser
