// src/features/dev/YamlToJson.tsx
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
import { parse as fromYaml } from 'yaml'

const YamlToJson: React.FC = () => {
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
        const jsonObject = fromYaml(values.input)
        setOutput(JSON.stringify(jsonObject, null, 2))
      } catch (error: any) {
        setOutput(`Error: Invalid YAML. ${error.message}`)
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
          YAML to JSON Converter
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Convert your YAML data into a structured JSON format.
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Textarea
                  label="Input YAML"
                  placeholder="key: value"
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
                      disabled={!output || output.startsWith('Error')}
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

export default YamlToJson
