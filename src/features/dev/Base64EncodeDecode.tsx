// src/features/converter/Base64EncodeDecode.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import { onActionMellowtel } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Select,
  Stack,
  Switch,
  Tabs,
  Text,
  Textarea,
  Title,
  Tooltip,
} from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { useForm } from '@mantine/form'
import { useClipboard } from '@mantine/hooks'
import FileSaver from 'file-saver'
import React, { useState } from 'react'

const Base64EncodeDecode: React.FC = () => {
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const clipboard = useClipboard({ timeout: 1000 })

  const form = useForm({
    initialValues: {
      input: '',
      mode: 'encode' as 'encode' | 'decode',
      charset: 'UTF-8',
      file: null as File | null,
      dataUri: true,
    },
  })

  const handleTextSubmit = async (values: typeof form.values) => {
    await onActionMellowtel(() => {
      setIsLoading(true)
      try {
        if (values.mode === 'encode') {
          const textEncoder = new TextEncoder()
          const encoded = textEncoder.encode(values.input)
          const binaryString = String.fromCharCode(...encoded)
          setOutput(btoa(binaryString))
        } else {
          const binaryString = atob(values.input)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          const decoder = new TextDecoder(values.charset)
          setOutput(decoder.decode(bytes))
        }
      } catch (error: any) {
        setOutput(`Error: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    })
  }

  const handleFileEncode = (files: File[]) => {
    if (!files[0]) return
    form.setFieldValue('file', files[0])
    setIsLoading(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      let base64String = (event.target?.result as string).split(',')[1]
      if (form.values.dataUri) {
        base64String = `data:${files[0].type};base64,${base64String}`
      }
      setOutput(base64String)
      setIsLoading(false)
    }
    reader.onerror = (error) => {
      setOutput(`Error reading file: ${error}`)
      setIsLoading(false)
    }
    reader.readAsDataURL(files[0])
  }

  const handleFileDecode = () => {
    if (!form.values.input) return
    setIsLoading(true)
    try {
      const base64Data = form.values.input.split(',')[1] || form.values.input
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray]) // MIME type is unknown here
      FileSaver.saveAs(blob, 'decoded-file')
    } catch (error: any) {
      setOutput(`Error: Invalid Base64 string. ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    form.reset()
    setOutput('')
  }

  return (
    <LayoutTool width={1000}>
      <Stack>
        <Title order={4} ta="center">
          Base64 Encoder & Decoder
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Encode text or files into Base64, or decode Base64 strings back to
          their original format.
        </Text>

        <Tabs defaultValue="text">
          <Tabs.List grow>
            <Tabs.Tab
              value="text"
              leftSection={<Icon icon="tabler:file-text" />}
            >
              Text
            </Tabs.Tab>
            <Tabs.Tab value="file" leftSection={<Icon icon="tabler:file" />}>
              File
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="text" pt="lg">
            <form onSubmit={form.onSubmit(handleTextSubmit)}>
              <Stack>
                <Card withBorder p="lg">
                  <Switch
                    checked={form.values.mode === 'encode'}
                    onChange={(event) =>
                      form.setFieldValue(
                        'mode',
                        event.currentTarget.checked ? 'encode' : 'decode',
                      )
                    }
                    label={
                      form.values.mode === 'encode'
                        ? 'Mode: Encode'
                        : 'Mode: Decode'
                    }
                  />
                  <Select
                    label="Character Set"
                    data={['UTF-8', 'ASCII']}
                    {...form.getInputProps('charset')}
                    mt="md"
                    disabled={form.values.mode === 'decode'}
                  />
                </Card>
                <Textarea
                  label={
                    form.values.mode === 'encode'
                      ? 'Input Text'
                      : 'Input Base64'
                  }
                  placeholder="Paste your content here..."
                  autosize
                  minRows={8}
                  maxRows={12}
                  styles={{ input: { fontFamily: 'monospace' } }}
                  {...form.getInputProps('input')}
                />
                <Button type="submit" loading={isLoading}>
                  {form.values.mode === 'encode'
                    ? 'Encode to Base64'
                    : 'Decode from Base64'}
                </Button>
              </Stack>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="file" pt="lg">
            <Stack>
              <Title order={5}>Encode File to Base64</Title>
              <Switch
                label="Include Data URI Scheme (data:mime/type;base64,...)"
                {...form.getInputProps('dataUri', { type: 'checkbox' })}
              />
              <Dropzone onDrop={handleFileEncode} multiple={false}>
                <Group
                  justify="center"
                  gap="xl"
                  mih={120}
                  style={{ pointerEvents: 'none' }}
                >
                  <Icon
                    icon="tabler:upload"
                    style={{
                      width: 52,
                      height: 52,
                      color: 'var(--mantine-color-dimmed)',
                    }}
                  />
                  <div>
                    <Text size="xl" inline>
                      Drag file here or click to select
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      The Base64 output will appear in the result box below.
                    </Text>
                  </div>
                </Group>
              </Dropzone>
              <Title order={5} mt="lg">
                Decode Base64 to File
              </Title>
              <Textarea
                label="Input Base64"
                placeholder="Paste your Base64 string here..."
                autosize
                minRows={8}
                maxRows={12}
                styles={{ input: { fontFamily: 'monospace' } }}
                {...form.getInputProps('input')}
              />
              <Button onClick={handleFileDecode} loading={isLoading}>
                Decode and Download File
              </Button>
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Card withBorder mt="lg">
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Result</Text>
            <div>
              <Tooltip label={clipboard.copied ? 'Copied!' : 'Copy Result'}>
                <ActionIcon
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
                  onClick={handleClear}
                  disabled={!form.values.input && !output}
                  color="red"
                  ml="sm"
                >
                  <Icon icon="tabler:clear-all" />
                </ActionIcon>
              </Tooltip>
            </div>
          </Group>
          <Textarea
            readOnly
            autosize
            minRows={8}
            maxRows={15}
            value={output}
            placeholder="Output will be shown here."
            styles={{ input: { fontFamily: 'monospace' } }}
          />
        </Card>
      </Stack>
    </LayoutTool>
  )
}

export default Base64EncodeDecode
