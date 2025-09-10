// src/features/Generator/WordRepeater.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import { onActionMellowtel } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useClipboard } from '@mantine/hooks'
import React from 'react'

const WordRepeater: React.FC = () => {
  const [output, setOutput] = React.useState('')
  const clipboard = useClipboard({ timeout: 1000 })

  const form = useForm({
    initialValues: {
      text: '',
      count: 10,
      separator: 'space',
      casing: 'original',
    },
    validate: {
      count: (value) =>
        value > 0 && value <= 5000 ? null : 'Count must be between 1 and 5000',
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    await onActionMellowtel(() => {
      let textToRepeat = values.text
      switch (values.casing) {
        case 'uppercase':
          textToRepeat = textToRepeat.toUpperCase()
          break
        case 'lowercase':
          textToRepeat = textToRepeat.toLowerCase()
          break
      }

      let separatorChar = ' '
      switch (values.separator) {
        case 'comma':
          separatorChar = ','
          break
        case 'newline':
          separatorChar = '\n'
          break
        case 'none':
          separatorChar = ''
          break
      }

      const result = Array(values.count).fill(textToRepeat).join(separatorChar)
      setOutput(result)
    })
  }

  return (
    <LayoutTool>
      <Stack>
        <Title order={4} ta="center">
          Word & Text Repeater
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Generate a repeated string of words or text with custom separators and
          casing.
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Card withBorder>
            <Stack>
              <TextInput
                label="Text to Repeat"
                placeholder="Enter word or phrase"
                {...form.getInputProps('text')}
              />
              <NumberInput
                label="Number of Repetitions"
                min={1}
                max={5000}
                {...form.getInputProps('count')}
              />
              <Group grow>
                <Select
                  label="Separator"
                  data={[
                    { value: 'space', label: 'Space' },
                    { value: 'comma', label: 'Comma' },
                    { value: 'newline', label: 'New Line' },
                    { value: 'none', label: 'No Separator' },
                  ]}
                  {...form.getInputProps('separator')}
                />
                <Select
                  label="Text Casing"
                  data={[
                    { value: 'original', label: 'Original Case' },
                    { value: 'uppercase', label: 'UPPERCASE' },
                    { value: 'lowercase', label: 'lowercase' },
                  ]}
                  {...form.getInputProps('casing')}
                />
              </Group>
              <Button type="submit" mt="md">
                Generate
              </Button>
            </Stack>
          </Card>
        </form>

        {output && (
          <Card withBorder mt="md">
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Result</Text>
              <Tooltip label={clipboard.copied ? 'Copied!' : 'Copy Result'}>
                <ActionIcon onClick={() => clipboard.copy(output)}>
                  <Icon
                    icon={clipboard.copied ? 'tabler:check' : 'tabler:copy'}
                  />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Textarea
              readOnly
              autosize
              minRows={6}
              maxRows={10}
              value={output}
            />
          </Card>
        )}
      </Stack>
    </LayoutTool>
  )
}

export default WordRepeater
