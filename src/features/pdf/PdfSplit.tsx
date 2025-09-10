// src/features/pdf/PdfSplit.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import toast from '@/utils/toast'
import { onActionMellowtel } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  Group,
  List,
  NumberInput,
  Paper,
  Radio,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core'
import { Dropzone, PDF_MIME_TYPE } from '@mantine/dropzone'
import { useForm } from '@mantine/form'
import FileSaver from 'file-saver'
import JSZip from 'jszip'
import { PDFDocument } from 'pdf-lib'
import React, { useState } from 'react'

const PdfSplit: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(0)

  const form = useForm({
    initialValues: {
      file: null as File | null,
      splitMode: 'ranges',
      ranges: '',
      fixedRange: 2,
      outputPrefix: 'split-document',
    },
    validate: {
      file: (value) => (value ? null : 'A PDF file is required'),
      ranges: (value, values) =>
        values.splitMode === 'ranges' && !value.trim()
          ? 'Custom range cannot be empty'
          : null,
      fixedRange: (value, values) =>
        values.splitMode === 'fixed' && (!value || value < 1)
          ? 'Range must be at least 1'
          : null,
      outputPrefix: (value) =>
        !value.trim() ? 'Output file prefix is required' : null,
    },
  })

  const handleFileDrop = async (files: File[]) => {
    if (!files[0]) return
    form.setFieldValue('file', files[0])
    form.setFieldValue('outputPrefix', files[0].name.replace(/\.pdf$/i, ''))
    try {
      const arrayBuffer = await files[0].arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      setTotalPages(pdfDoc.getPageCount())
    } catch (error) {
      console.error(error)
      toast.error('Failed to read the PDF file.')
      setTotalPages(0)
      form.setFieldValue('file', null)
    }
  }

  const handleClearFile = () => {
    form.setFieldValue('file', null)
    form.reset()
    setTotalPages(0)
  }

  const handleSplit = async (values: typeof form.values) => {
    await onActionMellowtel(async () => {
      if (!values.file) return
      setIsLoading(true)

      try {
        const originalPdfBytes = await values.file.arrayBuffer()
        const zip = new JSZip()
        let docIndex = 1

        // Parse page ranges based on the selected mode
        const pageRanges: number[][] = []
        if (values.splitMode === 'fixed') {
          for (let i = 0; i < totalPages; i += values.fixedRange) {
            pageRanges.push(
              Array.from(
                { length: Math.min(values.fixedRange, totalPages - i) },
                (_, k) => i + k,
              ),
            )
          }
        } else {
          const rangeStrings = values.ranges.split(',')
          for (const rangeStr of rangeStrings) {
            if (rangeStr.includes('-')) {
              const [start, end] = rangeStr.split('-').map(Number)
              pageRanges.push(
                Array.from(
                  { length: end - start + 1 },
                  (_, i) => start + i - 1,
                ),
              )
            } else {
              pageRanges.push([Number(rangeStr) - 1])
            }
          }
        }

        // Create new PDFs for each range
        for (const range of pageRanges) {
          const originalPdf = await PDFDocument.load(originalPdfBytes)
          const newPdf = await PDFDocument.create()
          const copiedPages = await newPdf.copyPages(
            originalPdf,
            range.filter((p) => p >= 0 && p < totalPages),
          )
          copiedPages.forEach((page) => newPdf.addPage(page))

          if (newPdf.getPageCount() > 0) {
            const newPdfBytes = await newPdf.save()
            zip.file(
              `${values.outputPrefix}-part-${docIndex++}.pdf`,
              newPdfBytes,
            )
          }
        }

        if (Object.keys(zip.files).length === 0) {
          toast.warning('No pages were extracted. Check your page ranges.')
        } else {
          const zipBlob = await zip.generateAsync({ type: 'blob' })
          FileSaver.saveAs(zipBlob, `${values.outputPrefix}-split.zip`)
          toast.success('PDF split and downloaded successfully!')
        }
      } catch (error) {
        console.error(error)
        toast.error('An error occurred while splitting the PDF.')
      } finally {
        setIsLoading(false)
      }
    })
  }

  return (
    <LayoutTool>
      <Stack>
        <Title order={4} ta="center">
          PDF Splitter
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Split a single PDF into multiple documents by fixed page intervals or
          custom ranges.
        </Text>
        <form onSubmit={form.onSubmit(handleSplit)}>
          <Card withBorder p="xl" radius="md">
            <Stack>
              {!form.values.file ? (
                <Dropzone
                  onDrop={handleFileDrop}
                  onReject={() => toast.error('Invalid file type or size.')}
                  maxSize={50 * 1024 ** 2}
                  accept={PDF_MIME_TYPE}
                  maxFiles={1}
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
                        icon="tabler:file-upload"
                        style={{
                          width: 52,
                          height: 52,
                          color: 'var(--mantine-color-dimmed)',
                        }}
                      />
                    </Dropzone.Idle>
                    <div>
                      <Text size="xl" inline>
                        Drag a PDF here or click to select
                      </Text>
                      <Text size="sm" c="dimmed" inline mt={7}>
                        Upload a single PDF file, up to 50MB
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
              ) : (
                <Paper withBorder p="md" radius="sm">
                  <List spacing="sm" size="sm" center>
                    <List.Item
                      icon={
                        <ThemeIcon color="red" size={24} radius="xl">
                          <Icon icon="tabler:file-type-pdf" fontSize={16} />
                        </ThemeIcon>
                      }
                    >
                      <Group justify="space-between">
                        <Stack gap={0}>
                          <Text size="sm" style={{ flex: 1 }}>
                            {form.values.file.name}
                          </Text>
                          <Text c="dimmed" size="xs">
                            Total Pages: {totalPages}
                          </Text>
                        </Stack>
                        <Tooltip label="Remove file">
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            onClick={handleClearFile}
                          >
                            <Icon icon="tabler:x" />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </List.Item>
                  </List>
                </Paper>
              )}

              <Radio.Group
                label="Split Mode"
                {...form.getInputProps('splitMode')}
              >
                <Group mt="xs">
                  <Radio value="ranges" label="Custom Ranges" />
                  <Radio value="fixed" label="Fixed Page Range" />
                </Group>
              </Radio.Group>

              {form.values.splitMode === 'ranges' && (
                <TextInput
                  label="Pages and Ranges"
                  placeholder="e.g., 1-3, 5, 8-10"
                  description={`Enter comma-separated page numbers or ranges. Max page: ${totalPages}`}
                  {...form.getInputProps('ranges')}
                />
              )}

              {form.values.splitMode === 'fixed' && (
                <NumberInput
                  label="Split every N pages"
                  placeholder="e.g., 2"
                  min={1}
                  max={totalPages}
                  {...form.getInputProps('fixedRange')}
                />
              )}

              <TextInput
                label="Output File Prefix"
                placeholder="Enter a name for the split files"
                {...form.getInputProps('outputPrefix')}
              />

              <Button
                type="submit"
                fullWidth
                size="md"
                mt="md"
                disabled={!form.values.file}
                loading={isLoading}
                leftSection={<Icon icon="tabler:cut" />}
              >
                Split PDF
              </Button>
            </Stack>
          </Card>
        </form>
      </Stack>
    </LayoutTool>
  )
}

export default PdfSplit
