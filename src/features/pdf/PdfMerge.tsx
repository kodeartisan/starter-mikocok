// src/features/pdf/PdfMerge.tsx
// English: A component to merge multiple PDF documents into a single file.

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
  Paper,
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
import { PDFDocument } from 'pdf-lib'
import React, { useState } from 'react'

const PdfMerge: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm({
    initialValues: {
      files: [] as File[],
      outputFilename: 'merged-document.pdf',
    },
    validate: {
      files: (value) =>
        value.length < 2 ? 'Please upload at least two PDF files.' : null,
      outputFilename: (value) =>
        !value.trim() ? 'Output filename cannot be empty.' : null,
    },
  })

  const handleFileDrop = (droppedFiles: File[]) => {
    form.setFieldValue('files', [...form.values.files, ...droppedFiles])
  }

  const handleRemoveFile = (index: number) => {
    form.setFieldValue(
      'files',
      form.values.files.filter((_, i) => i !== index),
    )
  }

  const handleMoveFile = (index: number, direction: 'up' | 'down') => {
    const { files } = form.values
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex < 0 || newIndex >= files.length) return

    const updatedFiles = [...files]
    ;[updatedFiles[index], updatedFiles[newIndex]] = [
      updatedFiles[newIndex],
      updatedFiles[index],
    ]
    form.setFieldValue('files', updatedFiles)
  }

  const handleMerge = async (values: typeof form.values) => {
    await onActionMellowtel(async () => {
      setIsLoading(true)
      try {
        const mergedPdf = await PDFDocument.create()

        for (const file of values.files) {
          const pdfBytes = await file.arrayBuffer()
          const pdfDoc = await PDFDocument.load(pdfBytes)
          const copiedPages = await mergedPdf.copyPages(
            pdfDoc,
            pdfDoc.getPageIndices(),
          )
          copiedPages.forEach((page) => mergedPdf.addPage(page))
        }

        const mergedPdfBytes = await mergedPdf.save()
        //@ts-ignore
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
        const filename = values.outputFilename.endsWith('.pdf')
          ? values.outputFilename
          : `${values.outputFilename}.pdf`
        FileSaver.saveAs(blob, filename)
        toast.success('PDFs merged and downloaded successfully!')
      } catch (error) {
        console.error(error)
        toast.error('An error occurred while merging the PDFs.')
      } finally {
        setIsLoading(false)
      }
    })
  }

  const fileList = form.values.files.map((file, index) => (
    <List.Item
      key={`${file.name}-${index}`}
      icon={
        <ThemeIcon color="red" size={24} radius="xl">
          <Icon icon="tabler:file-type-pdf" fontSize={16} />
        </ThemeIcon>
      }
    >
      <Group justify="space-between">
        <Text size="sm" style={{ flex: 1 }}>
          {file.name}
        </Text>
        <Group gap="xs">
          <Tooltip label="Move Up">
            <ActionIcon
              variant="subtle"
              onClick={() => handleMoveFile(index, 'up')}
              disabled={index === 0}
            >
              <Icon icon="tabler:arrow-up" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Move Down">
            <ActionIcon
              variant="subtle"
              onClick={() => handleMoveFile(index, 'down')}
              disabled={index === form.values.files.length - 1}
            >
              <Icon icon="tabler:arrow-down" />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Remove file">
            <ActionIcon
              color="red"
              variant="subtle"
              onClick={() => handleRemoveFile(index)}
            >
              <Icon icon="tabler:x" />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </List.Item>
  ))

  return (
    <LayoutTool>
      <Stack>
        <Title order={4} ta="center">
          PDF Merger
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Combine multiple PDF files into a single document. Drag to reorder.
        </Text>
        <form onSubmit={form.onSubmit(handleMerge)}>
          <Card withBorder p="xl" radius="md">
            <Stack>
              <Dropzone
                onDrop={handleFileDrop}
                onReject={() => toast.error('Invalid file type or size.')}
                maxSize={50 * 1024 ** 2}
                accept={PDF_MIME_TYPE}
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={120}
                  style={{ pointerEvents: 'none' }}
                >
                  <Icon
                    icon="tabler:file-upload"
                    style={{
                      width: 52,
                      height: 52,
                      color: 'var(--mantine-color-dimmed)',
                    }}
                  />
                  <div>
                    <Text size="xl" inline>
                      Drag PDF files here or click to select
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Upload two or more PDFs to merge
                    </Text>
                  </div>
                </Group>
              </Dropzone>

              {form.values.files.length > 0 && (
                <Paper withBorder p="md" mt="md" radius="sm">
                  <Text fw={500} mb="sm">
                    Files to Merge (in order)
                  </Text>
                  <List spacing="sm" size="sm" center>
                    {fileList}
                  </List>
                </Paper>
              )}

              <TextInput
                label="Output Filename"
                {...form.getInputProps('outputFilename')}
              />

              <Button
                type="submit"
                fullWidth
                size="md"
                mt="md"
                disabled={form.values.files.length < 2}
                loading={isLoading}
                leftSection={<Icon icon="tabler:copy" />}
              >
                Merge PDFs & Download
              </Button>
            </Stack>
          </Card>
        </form>
      </Stack>
    </LayoutTool>
  )
}

export default PdfMerge
