// src/features/image/ResizeImage.tsx
// English: A component to resize images with options for scaling, dimensions, and format conversion.

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
  NumberInput,
  Paper,
  Radio,
  SegmentedControl,
  SimpleGrid,
  Slider,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
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
  originalSize: string
  dimensions: string
}

const ResizeImage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([])

  const form = useForm({
    initialValues: {
      files: [] as File[],
      prefix: 'resized',
      resizeMode: 'percentage', // 'percentage' or 'dimensions'
      percentage: 50,
      width: 1024,
      height: 1024,
      maintainAspectRatio: true,
      outputFormat: 'original', // 'original', 'jpeg', 'png'
    },
    validate: {
      files: (value) =>
        value.length === 0 ? 'Please upload at least one image.' : null,
      prefix: (value) =>
        !value.trim() ? 'Filename prefix cannot be empty.' : null,
    },
  })

  // English: The core resizing logic.
  const handleResize = async (values: typeof form.values) => {
    await onActionMellowtel(async () => {
      setIsLoading(true)
      setProcessedFiles([])
      const resizePromises = values.files.map((file) => {
        return new Promise<ProcessedFile | null>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const img = document.createElement('img')
            img.onload = () => {
              const canvas = document.createElement('canvas')
              let { width, height } = img
              const aspectRatio = width / height

              // Calculate new dimensions
              if (values.resizeMode === 'percentage') {
                width = width * (values.percentage / 100)
                height = height * (values.percentage / 100)
              } else {
                if (values.maintainAspectRatio) {
                  if (width !== values.width) {
                    width = values.width
                    height = width / aspectRatio
                  } else if (height !== values.height) {
                    height = values.height
                    width = height * aspectRatio
                  }
                } else {
                  width = values.width
                  height = values.height
                }
              }

              canvas.width = Math.round(width)
              canvas.height = Math.round(height)

              const ctx = canvas.getContext('2d')
              if (!ctx) {
                toast.error(`Could not get canvas context for ${file.name}.`)
                return resolve(null)
              }
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

              let mimeType = file.type
              let extension = file.name.split('.').pop() || ''
              if (values.outputFormat !== 'original') {
                mimeType = `image/${values.outputFormat}`
                extension = values.outputFormat
              }

              canvas.toBlob((blob) => {
                if (blob) {
                  const newName = `${values.prefix}-${file.name
                    .split('.')
                    .slice(0, -1)
                    .join('.')}.${extension}`
                  resolve({
                    blob,
                    originalName: file.name,
                    newName,
                    url: URL.createObjectURL(blob),
                    size: `${(blob.size / 1024).toFixed(2)} KB`,
                    originalSize: `${(file.size / 1024).toFixed(2)} KB`,
                    dimensions: `${canvas.width}x${canvas.height}`,
                  })
                } else {
                  resolve(null)
                }
              }, mimeType)
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

      const results = await Promise.all(resizePromises)
      setProcessedFiles(
        results.filter((file): file is ProcessedFile => file !== null),
      )
      setIsLoading(false)
      if (results.some((r) => r !== null)) {
        toast.success('Image resizing completed successfully!')
      } else {
        toast.error('Resizing failed for all files.')
      }
    })
  }

  const handleDownloadAll = async () => {
    const zip = new JSZip()
    processedFiles.forEach((file) => {
      zip.file(file.newName, file.blob)
    })
    const content = await zip.generateAsync({ type: 'blob' })
    FileSaver.saveAs(content, 'resized-images.zip')
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
          Image Resizer
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Easily resize, scale, and convert images to different formats.
        </Text>
        <form onSubmit={form.onSubmit(handleResize)}>
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
                      toast.error('Please upload only valid image files.')
                    }
                    accept={IMAGE_MIME_TYPE}
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
                          Drag images here or click to select
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                          Resize multiple JPG, PNG, or WebP files at once.
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
                    <Title order={5}>Resize Options</Title>
                    <SegmentedControl
                      fullWidth
                      data={[
                        { label: 'By Percentage', value: 'percentage' },
                        { label: 'By Dimensions', value: 'dimensions' },
                      ]}
                      {...form.getInputProps('resizeMode')}
                    />

                    {form.values.resizeMode === 'percentage' ? (
                      <Stack gap={4}>
                        <Text size="sm" fw={500}>
                          Scale ({form.values.percentage}%)
                        </Text>
                        <Slider
                          min={1}
                          max={200}
                          step={1}
                          label={(value) => `${value}%`}
                          {...form.getInputProps('percentage')}
                        />
                      </Stack>
                    ) : (
                      <>
                        <Group grow>
                          <NumberInput
                            label="Width (px)"
                            {...form.getInputProps('width')}
                          />
                          <NumberInput
                            label="Height (px)"
                            {...form.getInputProps('height')}
                          />
                        </Group>
                        <Switch
                          label="Maintain aspect ratio"
                          {...form.getInputProps('maintainAspectRatio', {
                            type: 'checkbox',
                          })}
                        />
                      </>
                    )}

                    <Radio.Group
                      label="Output Format"
                      {...form.getInputProps('outputFormat')}
                    >
                      <Group mt="xs">
                        <Radio value="original" label="Original" />
                        <Radio value="jpeg" label="JPG" />
                        <Radio value="png" label="PNG" />
                      </Group>
                    </Radio.Group>
                    <TextInput
                      label="Output Filename Prefix"
                      {...form.getInputProps('prefix')}
                    />
                  </Stack>
                </Card>
                <Group grow>
                  <Button
                    type="submit"
                    size="md"
                    loading={isLoading}
                    disabled={form.values.files.length === 0}
                    leftSection={<Icon icon="tabler:arrows-minimize" />}
                  >
                    Resize Images
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
                <Title order={5}>Resized Files</Title>
                {processedFiles.length > 0 ? (
                  <Stack mt="md">
                    <Button
                      onClick={handleDownloadAll}
                      variant="light"
                      leftSection={<Icon icon="tabler:download" />}
                    >
                      Download All as .zip
                    </Button>
                    <SimpleGrid cols={{ base: 2, sm: 2, lg: 3 }} spacing="md">
                      {processedFiles.map((file, index) => (
                        <Paper withBorder p="xs" radius="md" key={index}>
                          <Image src={file.url} />
                          <Text size="xs" mt={4} truncate>
                            {file.newName}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {file.originalSize} → {file.size}
                          </Text>
                          <Text size="xs" c="dimmed">
                            Dims: {file.dimensions}
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
                        Your resized images will appear here.
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

export default ResizeImage
