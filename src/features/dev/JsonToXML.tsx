// src/features/Generator/JsonToXML.tsx
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
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useClipboard } from '@mantine/hooks'
import { parse as toXml } from 'js2xmlparser'
import React from 'react'

const JsonToXML: React.FC = () => {
  const [output, setOutput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const clipboard = useClipboard({ timeout: 1000 })

  const form = useForm({
    initialValues: {
      input: '',
      rootName: 'root',
    },
    validate: {
      rootName: (value) =>
        value.trim().length > 0 ? null : 'Root name is required',
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
        const result = toXml(values.rootName, parsedJson)
        setOutput(result)
      } catch (error: any) {
        setOutput(`Error: Invalid JSON. ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    })
  }

  const handleClear = () => {
    form.setValues({ input: '', rootName: 'root' })
    setOutput('')
  }

  return (
    <LayoutTool width={1000}>
      <Stack>
        <Title order={4} ta="center">
          JSON to XML Converter
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Transform your JSON objects into well-structured XML format.
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Card withBorder>
              <TextInput
                label="XML Root Element Name"
                description="The name for the top-level XML tag."
                {...form.getInputProps('rootName')}
              />
            </Card>
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Textarea
                  label="JSON Input"
                  placeholder='{ "user": { "name": "John" } }'
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
                  label="XML Output"
                  readOnly
                  autosize
                  minRows={12}
                  maxRows={20}
                  value={output}
                  placeholder={
                    '<root>\n  <user>\n    <name>John</name>\n  </user>\n</root>'
                  }
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
                  Convert to XML
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

export default JsonToXML
