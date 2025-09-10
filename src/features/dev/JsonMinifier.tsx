// src/features/Generator/JsonMinifier.tsx
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
import React, { useState } from 'react'

const JsonMinifier: React.FC = () => {
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const clipboard = useClipboard({ timeout: 1000 })

  const form = useForm({
    initialValues: {
      input: '',
    },
  })

  const handleSubmit = async (values: { input: string }) => {
    await onActionMellowtel(() => {
      if (!values.input) {
        setOutput('')
        return
      }
      setIsLoading(true)
      try {
        const parsedJson = JSON.parse(values.input)
        const result = JSON.stringify(parsedJson)
        setOutput(result)
      } catch (error: any) {
        setOutput(`Error: Invalid JSON. ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    })
  }

  const handleClear = () => {
    form.setFieldValue('input', '')
    setOutput('')
  }

  return (
    <LayoutTool width={1000}>
      <Stack>
        <Title order={4} ta="center">
          JSON Minifier
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Compact your JSON data by removing all whitespace, making it ideal for
          network transmission.
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Textarea
                  label="Input"
                  placeholder="Paste your code here..."
                  autosize
                  minRows={12}
                  maxRows={20}
                  styles={{
                    input: { fontFamily: 'monospace', fontSize: 14 },
                  }}
                  {...form.getInputProps('input')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Textarea
                  label="Output"
                  readOnly
                  autosize
                  minRows={12}
                  maxRows={20}
                  value={output}
                  placeholder="Result will be shown here..."
                  styles={{
                    input: { fontFamily: 'monospace', fontSize: 14 },
                  }}
                />
              </Grid.Col>
            </Grid>
            <Card withBorder>
              <Group justify="space-between">
                <Button
                  type="submit"
                  leftSection={<Icon icon="tabler:player-play" />}
                  loading={isLoading}
                >
                  Minify JSON
                </Button>
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
                  <Tooltip label="Clear Input & Output">
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

export default JsonMinifier
