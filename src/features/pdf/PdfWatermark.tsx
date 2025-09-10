// src/features/pdf/PdfWatermark.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import toast from '@/utils/toast'
import { onActionMellowtel } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  ColorInput,
  Group,
  List,
  NumberInput,
  Paper,
  Select,
  Slider,
  Stack,
  Switch,
  Tabs,
  Text,
  Textarea,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE, PDF_MIME_TYPE } from '@mantine/dropzone'
import { useForm } from '@mantine/form'
import FileSaver from 'file-saver'
import JSZip from 'jszip'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import React, { useState } from 'react'

const PdfWatermark: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    initialValues: {
      files: [] as File[],
      watermarkType: 'text',
      // Text options
      text: 'CONFIDENTIAL',
      font: StandardFonts.Helvetica,
      fontSize: 50,
      textColor: 'rgba(255, 0, 0, 0.5)',
      textRotation: -45,
      // Image options
      image: null as File | null,
      imageScale: 0.5,
      imageOpacity: 0.5,
      // Common options
      isTiled: true,
      position: 'center',
    },
    validate: {
      files: (value) =>
        value.length === 0 ? 'At least one PDF file is required.' : null,
      text: (value, values) =>
        values.watermarkType === 'text' && !value.trim()
          ? 'Watermark text cannot be empty.'
          : null,
      image: (value, values) =>
        values.watermarkType === 'image' && !value
          ? 'An image file is required.'
          : null,
    },
  })

  const handleWatermark = async (values: typeof form.values) => {
    await onActionMellowtel(async () => {
      setIsLoading(true)
      const zip = new JSZip()

      try {
        let watermarkImageBytes: ArrayBuffer | null = null
        if (values.watermarkType === 'image' && values.image) {
          watermarkImageBytes = await values.image.arrayBuffer()
        }

        for (const file of values.files) {
          const pdfBytes = await file.arrayBuffer()
          const pdfDoc = await PDFDocument.load(pdfBytes)
          const font = await pdfDoc.embedFont(values.font)

          const pages = pdfDoc.getPages()
          for (const page of pages) {
            const { width, height } = page.getSize()

            if (values.watermarkType === 'text') {
              const textWidth = font.widthOfTextAtSize(
                values.text,
                values.fontSize,
              )
              const color =
                /rgba?\((\d+), (\d+), (\d+)(, ([\d.]+))?\)/.exec(
                  values.textColor,
                ) || []
              page.drawText(values.text, {
                x: width / 2 - textWidth / 2,
                y: height / 2,
                font,
                size: values.fontSize,
                color: rgb(
                  Number(color[1] || 255) / 255,
                  Number(color[2] || 0) / 255,
                  Number(color[3] || 0) / 255,
                ),
                opacity: Number(color[5] ?? 0.5),
                //@ts-ignore
                rotate: { degrees: values.textRotation, type: 'degrees' },
              })
            } else if (watermarkImageBytes) {
              const image = await pdfDoc.embedPng(watermarkImageBytes)
              const imgDims = image.scale(values.imageScale)
              page.drawImage(image, {
                x: width / 2 - imgDims.width / 2,
                y: height / 2 - imgDims.height / 2,
                width: imgDims.width,
                height: imgDims.height,
                opacity: values.imageOpacity,
              })
            }
          }
          const modifiedPdfBytes = await pdfDoc.save()
          zip.file(
            file.name.replace(/\.pdf$/i, '-watermarked.pdf'),
            modifiedPdfBytes,
          )
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        FileSaver.saveAs(zipBlob, 'watermarked-documents.zip')
        toast.success('PDFs watermarked successfully!')
      } catch (error) {
        console.error(error)
        toast.error('An error occurred during the watermarking process.')
      } finally {
        setIsLoading(false)
      }
    })
  }

  const fileList = form.values.files.map((file, index) => (
    <List.Item
      key={index}
      icon={
        <ThemeIcon color="red" size={24} radius="xl">
          <Icon icon="tabler:file-type-pdf" fontSize={16} />
        </ThemeIcon>
      }
    >
      <Group justify="space-between">
        <Text size="sm">{file.name}</Text>
        <ActionIcon
          color="red"
          variant="subtle"
          onClick={() =>
            form.setFieldValue(
              'files',
              form.values.files.filter((_, i) => i !== index),
            )
          }
        >
          <Icon icon="tabler:x" />
        </ActionIcon>
      </Group>
    </List.Item>
  ))

  return (
    <LayoutTool>
      <Stack>
        <Title order={4} ta="center">
          PDF Watermarker
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Apply a text or image watermark to one or more PDF files with
          extensive customization.
        </Text>

        <form onSubmit={form.onSubmit(handleWatermark)}>
          <Card withBorder p="xl" radius="md">
            <Stack>
              <Dropzone
                onDrop={(droppedFiles) =>
                  form.setFieldValue('files', [
                    ...form.values.files,
                    ...droppedFiles,
                  ])
                }
                accept={PDF_MIME_TYPE}
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={80}
                  style={{ pointerEvents: 'none' }}
                >
                  <Icon
                    icon="tabler:file-upload"
                    style={{
                      width: 42,
                      height: 42,
                      color: 'var(--mantine-color-dimmed)',
                    }}
                  />
                  <div>
                    <Text size="lg" inline>
                      Drag PDF files here or click
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Add one or more files to be watermarked
                    </Text>
                  </div>
                </Group>
              </Dropzone>

              {form.values.files.length > 0 && (
                <Paper withBorder p="md" mt="md" radius="sm">
                  <List spacing="sm" size="sm" center>
                    {fileList}
                  </List>
                </Paper>
              )}

              <Tabs
                defaultValue="text"
                {...form.getInputProps('watermarkType')}
              >
                <Tabs.List grow>
                  <Tabs.Tab
                    value="text"
                    leftSection={<Icon icon="tabler:typography" />}
                  >
                    Text Watermark
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="image"
                    leftSection={<Icon icon="tabler:photo" />}
                  >
                    Image Watermark
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="text" pt="lg">
                  <Stack>
                    <Textarea
                      label="Watermark Text"
                      {...form.getInputProps('text')}
                    />
                    <Group grow>
                      <Select
                        label="Font"
                        data={Object.values(StandardFonts)}
                        {...form.getInputProps('font')}
                      />
                      <NumberInput
                        label="Font Size"
                        min={8}
                        max={200}
                        {...form.getInputProps('fontSize')}
                      />
                    </Group>
                    <ColorInput
                      label="Text Color & Opacity"
                      format="rgba"
                      {...form.getInputProps('textColor')}
                    />
                    <Stack gap={4}>
                      <Text size="sm">
                        Rotation ({form.values.textRotation}°)
                      </Text>
                      <Slider
                        min={-180}
                        max={180}
                        {...form.getInputProps('textRotation')}
                      />
                    </Stack>
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="image" pt="lg">
                  <Stack>
                    <Dropzone
                      onDrop={(files) => form.setFieldValue('image', files[0])}
                      accept={IMAGE_MIME_TYPE}
                      maxFiles={1}
                    >
                      <Group justify="center">
                        <Icon icon="tabler:photo-plus" fontSize={32} />
                        <Text size="sm">
                          {form.values.image
                            ? form.values.image.name
                            : 'Drop image or click to upload'}
                        </Text>
                      </Group>
                    </Dropzone>
                    <Stack gap={4}>
                      <Text size="sm">
                        Scale ({form.values.imageScale.toFixed(2)})
                      </Text>
                      <Slider
                        min={0.1}
                        max={2}
                        step={0.05}
                        {...form.getInputProps('imageScale')}
                      />
                    </Stack>
                    <Stack gap={4}>
                      <Text size="sm">
                        Opacity ({form.values.imageOpacity.toFixed(2)})
                      </Text>
                      <Slider
                        min={0.1}
                        max={1}
                        step={0.05}
                        {...form.getInputProps('imageOpacity')}
                      />
                    </Stack>
                  </Stack>
                </Tabs.Panel>
              </Tabs>
              <Switch
                mt="md"
                label="Tiled Watermark (Coming Soon)"
                description="This feature is not yet implemented."
                disabled
                {...form.getInputProps('isTiled', { type: 'checkbox' })}
              />

              <Button
                type="submit"
                fullWidth
                size="md"
                mt="xl"
                loading={isLoading}
                disabled={form.values.files.length === 0}
                leftSection={<Icon icon="tabler:brand-sentry" />}
              >
                Apply Watermark & Download
              </Button>
            </Stack>
          </Card>
        </form>
      </Stack>
    </LayoutTool>
  )
}

export default PdfWatermark
