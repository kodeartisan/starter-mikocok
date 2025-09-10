// src/features/image/PngToJpg.tsx
// English: A component to convert PNG images to JPG format, allowing users to set a background color and quality.

import LayoutTool from '@/components/Layout/LayoutTool'
import toast from '@/utils/toast'
import { onActionMellowtel } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  Center,
  ColorInput,
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

const PngToJpg: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([])

  const form = useForm({
    initialValues: {
      files: [] as File[],
      prefix: 'converted',
      quality: 80,
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
    validate: {
      files: (value) =>
        value.length === 0 ? 'Please upload at least one PNG file.' : null,
      prefix: (value) =>
        !value.trim() ? 'Filename prefix cannot be empty.' : null,
    },
  })

  // English: The core conversion logic.
  const handleConvert = async (values: typeof form.values) => {
    await onActionMellowtel(async () => {
      setIsLoading(true)
      setProcessedFiles([])

      const conversionPromises = values.files.map((file) => {
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

              // English: Fill background for PNG transparency before drawing the image.
              ctx.fillStyle = values.backgroundColor
              ctx.fillRect(0, 0, canvas.width, canvas.height)
              ctx.drawImage(img, 0, 0)

              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    const newName = `${values.prefix}-${file.name.replace(/\.png$/i, '')}.jpg`
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
                values.quality / 100, // English: Quality is a value between 0 and 1.
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

      const results = await Promise.all(conversionPromises)
      setProcessedFiles(
        results.filter((file): file is ProcessedFile => file !== null),
      )
      setIsLoading(false)

      if (results.some((r) => r !== null)) {
        toast.success('Conversion completed successfully!')
      } else {
        toast.error('Conversion failed for all files.')
      }
    })
  }

  // English: Download all processed files as a ZIP archive.
  const handleDownloadAll = async () => {
    const zip = new JSZip()
    processedFiles.forEach((file) => {
      zip.file(file.newName, file.blob)
    })
    const content = await zip.generateAsync({ type: 'blob' })
    FileSaver.saveAs(content, 'converted-jpg-images.zip')
  }

  // English: Clear all inputs and results.
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
          PNG to JPG Converter
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Convert your PNG images to JPG format. Set a custom background color
          and quality.
        </Text>
        <form onSubmit={form.onSubmit(handleConvert)}>
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
                      toast.error('Please upload only PNG images.')
                    }
                    accept={['image/png']}
                  >
                    <Group
                      justify="center"
                      gap="xl"
                      mih={120}
                      style={{ pointerEvents: 'none' }}
                    >
                      <Icon
                        icon="tabler:photo-up"
                        style={{
                          width: 52,
                          height: 52,
                          color: 'var(--mantine-color-dimmed)',
                        }}
                      />
                      <div>
                        <Text size="xl" inline>
                          Drag PNGs here or click to select
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          Attach as many files as you like.
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
                    <Title order={5}>Conversion Options</Title>
                    <TextInput
                      label="Output Filename Prefix"
                      placeholder="e.g., jpg-file"
                      {...form.getInputProps('prefix')}
                    />
                    <ColorInput
                      label="Background Color for Transparency"
                      format="rgba"
                      {...form.getInputProps('backgroundColor')}
                    />
                    <Stack gap={4}>
                      <Text size="sm" fw={500}>
                        JPG Quality ({form.values.quality}%)
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
                    leftSection={<Icon icon="tabler:transform" />}
                  >
                    Convert to JPG
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
                <Title order={5}>Converted Files</Title>
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
                        Your converted JPGs will appear here.
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

export default PngToJpg
