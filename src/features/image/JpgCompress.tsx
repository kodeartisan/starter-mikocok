// src/features/image/JpgCompress.tsx
// English: A component to compress JPG images by adjusting the output quality.

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
  Slider,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { useForm } from '@mantine/form'
import FileSaver from 'file-saver'
import JSZip from 'jszip'
import React, { useState } from 'react'

// English: A reusable interface for processed files to avoid code duplication.
interface ProcessedFile {
  blob: Blob
  originalName: string
  newName: string
  url: string
  size: string
}

const JpgCompress: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([])

  const form = useForm({
    initialValues: {
      files: [] as File[],
      prefix: 'compressed',
      quality: 75,
    },
    validate: {
      files: (value) =>
        value.length === 0 ? 'Please upload at least one JPG file.' : null,
      prefix: (value) =>
        !value.trim() ? 'Filename prefix cannot be empty.' : null,
    },
  })

  // English: The core compression logic.
  const handleCompress = async (values: typeof form.values) => {
    await onActionMellowtel(async () => {
      setIsLoading(true)
      setProcessedFiles([])

      const compressionPromises = values.files.map((file) => {
        return new Promise<ProcessedFile | null>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const img = document.createElement('img')
            img.onload = () => {
              const canvas = document.createElement('canvas')
              canvas.width = img.width
              canvas.height = img.height
              const ctx = canvas.getContext('2d')

              if (!ctx) {
                toast.error(`Could not get canvas context for ${file.name}.`)
                return resolve(null)
              }

              ctx.drawImage(img, 0, 0)

              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    const newName = `${values.prefix}-${file.name}`
                    resolve({
                      blob,
                      originalName: file.name,
                      newName,
                      url: URL.createObjectURL(blob),
                      size: `${(blob.size / 1024).toFixed(2)} KB`,
                    })
                  } else {
                    resolve(null)
                  }
                },
                'image/jpeg',
                values.quality / 100,
              )
            }
            img.onerror = () => {
              toast.error(`Failed to load image: ${file.name}.`)
              resolve(null)
            }
            img.src = e.target?.result as string
          }
          reader.onerror = () => {
            toast.error(`Failed to read file: ${file.name}.`)
            resolve(null)
          }
          reader.readAsDataURL(file)
        })
      })

      const results = await Promise.all(compressionPromises)
      setProcessedFiles(
        results.filter((file): file is ProcessedFile => file !== null),
      )
      setIsLoading(false)

      if (results.some((r) => r !== null)) {
        toast.success('Compression completed successfully!')
      } else {
        toast.error('Compression failed for all files.')
      }
    })
  }

  const handleDownloadAll = async () => {
    const zip = new JSZip()
    processedFiles.forEach((file) => {
      zip.file(file.newName, file.blob)
    })
    const content = await zip.generateAsync({ type: 'blob' })
    FileSaver.saveAs(content, 'compressed-jpg-images.zip')
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
        <Text size="xs" mt={4} truncate>
          {file.name}
        </Text>
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
          JPG Compressor
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Reduce the file size of your JPG images by adjusting the compression
          level.
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
                    onReject={() =>
                      toast.error('Please upload only JPG/JPEG images.')
                    }
                    accept={['image/jpeg']}
                  >
                    <Group
                      justify="center"
                      gap="xl"
                      mih={120}
                      style={{ pointerEvents: 'none' }}
                    >
                      <Icon
                        icon="tabler:photo-down"
                        style={{
                          width: 52,
                          height: 52,
                          color: 'var(--mantine-color-dimmed)',
                        }}
                      />
                      <div>
                        <Text size="xl" inline>
                          Drag JPGs here or click to select
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          Optimize as many images as you like.
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
                    <TextInput
                      label="Output Filename Prefix"
                      placeholder="e.g., compressed"
                      {...form.getInputProps('prefix')}
                    />
                    <Stack gap={4}>
                      <Text size="sm" fw={500}>
                        Image Quality ({form.values.quality}%)
                      </Text>
                      <Slider
                        min={1}
                        max={100}
                        step={1}
                        label={(value) => `${value}%`}
                        {...form.getInputProps('quality')}
                      />
                    </Stack>
                  </Stack>
                </Card>
                <Group grow>
                  <Button
                    type="submit"
                    size="md"
                    loading={isLoading}
                    disabled={form.values.files.length === 0}
                    leftSection={<Icon icon="tabler:compress" />}
                  >
                    Compress JPG
                  </Button>
                  <Button
                    variant="light"
                    color="red"
                    size="md"
                    onClick={handleClearAll}
                    disabled={
                      form.values.files.length === 0 &&
                      processedFiles.length === 0
                    }
                    leftSection={<Icon icon="tabler:clear-all" />}
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
                    <Button
                      onClick={handleDownloadAll}
                      variant="light"
                      leftSection={<Icon icon="tabler:download" />}
                    >
                      Download All as .zip
                    </Button>
                    <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }} spacing="md">
                      {processedFiles.map((file, index) => (
                        <Paper withBorder p="xs" radius="md" key={index}>
                          <Image src={file.url} />
                          <Text size="xs" mt={4} truncate>
                            {file.newName}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {file.size}
                          </Text>
                          <Button
                            fullWidth
                            mt="xs"
                            size="xs"
                            variant="outline"
                            onClick={() =>
                              FileSaver.saveAs(file.blob, file.newName)
                            }
                            leftSection={<Icon icon="tabler:download" />}
                          >
                            Download
                          </Button>
                        </Paper>
                      ))}
                    </SimpleGrid>
                  </Stack>
                ) : (
                  <Center h="80%">
                    <Stack align="center" gap="md">
                      <Icon
                        icon="tabler:photo-check"
                        style={{
                          width: 64,
                          height: 64,
                          color: 'var(--mantine-color-dimmed)',
                        }}
                      />
                      <Text c="dimmed">
                        Your compressed JPGs will appear here.
                      </Text>
                    </Stack>
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

export default JpgCompress
