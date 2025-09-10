// src/features/generator/SVGCompressor.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import toast from '@/utils/toast'
import { onActionMellowtel } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Grid,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { useForm } from '@mantine/form'
import FileSaver from 'file-saver'
import JSZip from 'jszip'
import React from 'react'

interface ProcessedFile {
  blob: Blob
  originalName: string
  url: string
  originalSize: string
  newSize: string
  savings: string
}

const SVGCompressor: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [processedFiles, setProcessedFiles] = React.useState<ProcessedFile[]>(
    [],
  )
  const form = useForm({
    initialValues: {
      files: [] as File[],
      removeComments: true,
      removeMetadata: true,
      removeXmlns: true,
    },
    validate: {
      files: (value) =>
        value.length === 0 ? 'Please upload at least one SVG file.' : null,
    },
  })

  const simpleCompress = (svgString: string): string => {
    let compressed = svgString

    if (form.values.removeMetadata) {
      compressed = compressed.replace(/<metadata>[\s\S]*?<\/metadata>/g, '')
    }
    if (form.values.removeXmlns) {
      compressed = compressed.replace(/\s*xmlns="[^"]+"/g, '')
    }
    // Remove extra whitespace
    return compressed.replace(/>\s+</g, '><').trim()
  }

  const handleCompress = async (values: typeof form.values) => {
    await onActionMellowtel(async () => {
      setIsLoading(true)
      setProcessedFiles([])

      const compressionPromises = values.files.map((file) => {
        return new Promise<ProcessedFile | null>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const originalContent = e.target?.result as string
            const compressedContent = simpleCompress(originalContent)
            const originalSize = file.size
            const newBlob = new Blob([compressedContent], {
              type: 'image/svg+xml',
            })
            const newSize = newBlob.size
            const savings =
              originalSize > 0
                ? ((1 - newSize / originalSize) * 100).toFixed(2)
                : '0.00'

            resolve({
              blob: newBlob,
              originalName: file.name,
              url: URL.createObjectURL(newBlob),
              originalSize: `${(originalSize / 1024).toFixed(2)} KB`,
              newSize: `${(newSize / 1024).toFixed(2)} KB`,
              savings: `${savings}%`,
            })
          }
          reader.onerror = () => resolve(null)
          reader.readAsText(file)
        })
      })

      const results = await Promise.all(compressionPromises)
      setProcessedFiles(
        results.filter((file): file is ProcessedFile => file !== null),
      )
      setIsLoading(false)
      toast.success('Compression complete!')
    })
  }

  const handleDownloadAll = async () => {
    const zip = new JSZip()
    processedFiles.forEach((file) => {
      zip.file(file.originalName, file.blob)
    })
    const content = await zip.generateAsync({ type: 'blob' })
    FileSaver.saveAs(content, 'compressed-svg-images.zip')
  }

  const handleClearAll = () => {
    form.reset()
    setProcessedFiles([])
  }

  const previews = form.values.files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return (
      <Paper withBorder p="xs" radius="md" key={index} pos="relative">
        <Image src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />
        <ActionIcon
          pos="absolute"
          top={4}
          right={4}
          color="red"
          variant="light"
          size="sm"
          onClick={() =>
            form.setFieldValue(
              'files',
              form.values.files.filter((_, i) => i !== index),
            )
          }
        >
          <Icon icon="tabler:x" />
        </ActionIcon>
      </Paper>
    )
  })

  return (
    <LayoutTool>
      <Stack>
        <Title order={4} ta="center">
          SVG Compressor
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Reduce the file size of your SVG images by removing unnecessary data.
        </Text>
        <form onSubmit={form.onSubmit(handleCompress)}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Stack>
                <Card withBorder p="xl" radius="md">
                  <Dropzone
                    onDrop={(files) =>
                      form.setFieldValue('files', [
                        ...form.values.files,
                        ...files,
                      ])
                    }
                    accept={['image/svg+xml']}
                  >
                    <Group justify="center" gap="xl" mih={120}>
                      <Icon
                        icon="tabler:file-zip"
                        style={{
                          width: 52,
                          height: 52,
                          color: 'var(--mantine-color-dimmed)',
                        }}
                      />
                      <div>
                        <Text size="xl" inline>
                          Drag SVGs here or click
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                  {previews.length > 0 && (
                    <SimpleGrid cols={{ base: 2, sm: 3 }} mt="md">
                      {previews}
                    </SimpleGrid>
                  )}
                </Card>
                <Card withBorder p="xl" radius="md">
                  <Stack>
                    <Title order={5}>Compression Options</Title>
                    <Switch
                      label="Remove comments"
                      {...form.getInputProps('removeComments', {
                        type: 'checkbox',
                      })}
                    />
                    <Switch
                      label="Remove metadata"
                      {...form.getInputProps('removeMetadata', {
                        type: 'checkbox',
                      })}
                    />
                    <Switch
                      label="Remove xmlns attribute"
                      {...form.getInputProps('removeXmlns', {
                        type: 'checkbox',
                      })}
                    />
                  </Stack>
                </Card>
                <Group grow>
                  <Button type="submit" size="md" loading={isLoading}>
                    Compress
                  </Button>
                  <Button
                    variant="light"
                    color="red"
                    size="md"
                    onClick={handleClearAll}
                  >
                    Clear All
                  </Button>
                </Group>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Card withBorder p="xl" radius="md" h="100%">
                <Title order={5}>Compressed Files</Title>
                {processedFiles.length > 0 ? (
                  <Stack mt="md">
                    <Button onClick={handleDownloadAll} variant="light">
                      Download All as .zip
                    </Button>
                    <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
                      {processedFiles.map((file, index) => (
                        <Paper withBorder p="xs" radius="md" key={index}>
                          <Image src={file.url} />
                          <Text size="xs" c="dimmed" mt={4}>
                            {file.originalSize} → {file.newSize}
                          </Text>
                          <Text size="sm" c="teal" fw={700}>
                            Saved: {file.savings}
                          </Text>
                          <Button
                            fullWidth
                            mt="xs"
                            size="xs"
                            variant="outline"
                            onClick={() =>
                              FileSaver.saveAs(file.blob, file.originalName)
                            }
                          >
                            Download
                          </Button>
                        </Paper>
                      ))}
                    </SimpleGrid>
                  </Stack>
                ) : (
                  <Center h="80%">
                    <Text c="dimmed">
                      Your compressed SVGs will appear here.
                    </Text>
                  </Center>
                )}
              </Card>
            </Grid.Col>
          </Grid>
        </form>
      </Stack>
    </LayoutTool>
  )
}

export default SVGCompressor
