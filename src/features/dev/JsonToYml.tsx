// src/features/Generator/JsonToYml.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import { onActionMellowtel } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  Grid,
  Group,
  NumberInput,
  Stack,
  Text,
  Textarea,
  Title,
  Tooltip,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useClipboard } from '@mantine/hooks'
import React from 'react'
import { stringify as toYaml } from 'yaml'

const JsonToYml: React.FC = () => {
  const [output, setOutput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const clipboard = useClipboard({ timeout: 1000 })

  const form = useForm({
    initialValues: {
      input: '',
      indent: 2,
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    await onActionMellowtel(() => {
      if (!values.input) {
        setOutput('')
        return
      }
      setIsLoading(true)
      try {
        const parsedJson = JSON.parse(values.input)
        const result = toYaml(parsedJson, { indent: values.indent })
        setOutput(result)
      } catch (error: any) {
        setOutput(`Error: Invalid JSON. ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    })
  }

  const handleClear = () => {
    form.setValues({ input: '', indent: 2 })
    setOutput('')
  }

  return (
    <LayoutTool width={1000}>
      <Stack>
        <Title order={4} ta="center">
          JSON to YML Converter
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Easily convert your JSON data into the YAML format with customizable
          indentation.
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Card withBorder>
              <NumberInput
                label="Indentation Level"
                description="Number of spaces for indentation."
                min={1}
                max={8}
                {...form.getInputProps('indent')}
              />
            </Card>
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Textarea
                  label="JSON Input"
                  placeholder='{ "key": "value" }'
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
                  label="YAML Output"
                  readOnly
                  autosize
                  minRows={12}
                  maxRows={20}
                  value={output}
                  placeholder="key: value"
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
                  leftSection={<Icon icon="tabler:transform" />}
                  loading={isLoading}
                >
                  Convert to YAML
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
                  <Tooltip label="Clear All">
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

export default JsonToYml
