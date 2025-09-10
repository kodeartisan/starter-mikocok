// src/features/image/JpgToPng.tsx
// English: A feature-rich component to convert JPG images to PNG with advanced options.

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
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { Dropzone } from '@mantine/dropzone'
import { useForm } from '@mantine/form'
import FileSaver from 'file-saver'
import JSZip from 'jszip'
import React, { useState } from 'react'

// Define the structure for a converted file
interface ConvertedFile {
  blob: Blob
  originalName: string
  newName: string
  url: string
  size: string
}

const JpgToPng: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([])

  // Use Mantine form to manage inputs and files
  const form = useForm({
    initialValues: {
      files: [] as File[],
      prefix: 'converted',
      removeBackground: false,
      targetColor: 'rgba(255, 255, 255, 1)',
      tolerance: 10,
    },
    validate: {
      files: (value) =>
        value.length === 0 ? 'Please upload at least one JPG file.' : null,
      prefix: (value) =>
        !value.trim() ? 'Filename prefix cannot be empty.' : null,
    },
  })

  // Helper to parse RGBA color string for canvas processing
  const parseRgba = (rgba: string) => {
    const result = rgba.match(/\d+/g)?.map(Number)
    return result ? { r: result[0], g: result[1], b: result[2] } : null
  }

  // The core conversion logic
  const handleConvert = async (values: typeof form.values) => {
    await onActionMellowtel(async () => {
      setIsLoading(true)
      setConvertedFiles([]) // Clear previous results

      const conversionPromises = values.files.map((file) => {
        return new Promise<ConvertedFile | null>((resolve) => {
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

              // Handle background removal if enabled
              if (values.removeBackground) {
                const targetColor = parseRgba(values.targetColor)
                if (targetColor) {
                  const imageData = ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                  )
                  const data = imageData.data
                  for (let i = 0; i < data.length; i += 4) {
                    const r = data[i]
                    const g = data[i + 1]
                    const b = data[i + 2]
                    // Calculate color distance to check against tolerance
                    const distance = Math.sqrt(
                      Math.pow(r - targetColor.r, 2) +
                        Math.pow(g - targetColor.g, 2) +
                        Math.pow(b - targetColor.b, 2),
                    )
                    if (distance < values.tolerance) {
                      data[i + 3] = 0 // Make pixel transparent by setting alpha to 0
                    }
                  }
                  ctx.putImageData(imageData, 0, 0)
                }
              }

              canvas.toBlob((blob) => {
                if (blob) {
                  const newName = `${values.prefix}-${file.name.replace(/\.jpe?g$/i, '')}.png`
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
              }, 'image/png')
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
      setConvertedFiles(
        results.filter((file): file is ConvertedFile => file !== null),
      )
      setIsLoading(false)
      if (results.some((r) => r !== null)) {
        toast.success('Conversion completed successfully!')
      } else {
        toast.error('Conversion failed for all files.')
      }
    })
  }

  // Download all converted files as a ZIP archive
  const handleDownloadAll = async () => {
    const zip = new JSZip()
    convertedFiles.forEach((file) => {
      zip.file(file.newName, file.blob)
    })
    const content = await zip.generateAsync({ type: 'blob' })
    FileSaver.saveAs(content, 'converted-png-images.zip')
  }

  // Clear all inputs and results
  const handleClearAll = () => {
    form.reset()
    setConvertedFiles([])
  }

  // Generate file previews for the dropzone
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
          JPG to PNG Converter
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Convert your JPG images to PNG format. Optionally remove a background
          color to create transparency.
        </Text>

        <form onSubmit={form.onSubmit(handleConvert)}>
          <Grid>
            {/* Input and Options Column */}
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Stack>
                <Card withBorder p="xl" radius="md">
                  <Stack>
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
                        <Dropzone.Accept>
                          <Icon
                            icon="tabler:upload"
                            style={{
                              width: 52,
                              height: 52,
                              color: 'var(--mantine-color-blue-6)',
                            }}
                          />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                          <Icon
                            icon="tabler:x"
                            style={{
                              width: 52,
                              height: 52,
                              color: 'var(--mantine-color-red-6)',
                            }}
                          />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                          <Icon
                            icon="tabler:photo-up"
                            style={{
                              width: 52,
                              height: 52,
                              color: 'var(--mantine-color-dimmed)',
                            }}
                          />
                        </Dropzone.Idle>
                        <div>
                          <Text size="xl" inline>
                            Drag JPGs here or click to select
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
                  </Stack>
                </Card>

                <Card withBorder p="xl" radius="md">
                  <Stack>
                    <Title order={5}>Conversion Options</Title>
                    <TextInput
                      label="Output Filename Prefix"
                      placeholder="e.g., png-file"
                      {...form.getInputProps('prefix')}
                    />
                    <Switch
                      label="Remove background color"
                      description="Make a specific color transparent."
                      {...form.getInputProps('removeBackground', {
                        type: 'checkbox',
                      })}
                    />
                    {form.values.removeBackground && (
                      <Stack>
                        <ColorInput
                          label="Color to make transparent"
                          format="rgba"
                          {...form.getInputProps('targetColor')}
                        />
                        <Stack gap={4}>
                          <Text size="sm" fw={500}>
                            Color Matching Tolerance ({form.values.tolerance})
                          </Text>
                          <Slider
                            min={1}
                            max={100}
                            step={1}
                            label={(value) => value}
                            {...form.getInputProps('tolerance')}
                          />
                        </Stack>
                      </Stack>
                    )}
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
                    Convert to PNG
                  </Button>
                  <Button
                    variant="light"
                    color="red"
                    size="md"
                    onClick={handleClearAll}
                    disabled={
                      form.values.files.length === 0 &&
                      convertedFiles.length === 0
                    }
                    leftSection={<Icon icon="tabler:clear-all" />}
                  >
                    Clear All
                  </Button>
                </Group>
              </Stack>
            </Grid.Col>

            {/* Output Column */}
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Card withBorder p="xl" radius="md" h="100%">
                <Title order={5}>Converted Files</Title>
                {convertedFiles.length > 0 ? (
                  <Stack mt="md">
                    <Button
                      onClick={handleDownloadAll}
                      variant="light"
                      leftSection={<Icon icon="tabler:download" />}
                    >
                      Download All as .zip
                    </Button>
                    <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }} spacing="md">
                      {convertedFiles.map((file, index) => (
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
                        Your converted PNGs will appear here.
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

export default JpgToPng
