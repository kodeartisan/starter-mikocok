// src/features/generator/FaviconGenerator.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import toast from '@/utils/toast'
import { onActionMellowtel } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Button,
  Card,
  Checkbox,
  Code,
  CopyButton,
  Grid,
  Group,
  Image,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import FileSaver from 'file-saver'
import JSZip from 'jszip'
import React, { useCallback, useMemo, useState } from 'react'

interface GeneratedFavicon {
  size: number
  blob: Blob
  url: string
}

const FAVICON_SIZES = [16, 32, 48, 64, 128, 180, 192, 512]

const FaviconGenerator: React.FC = () => {
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [sourceUrl, setSourceUrl] = useState<string>('')
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFavicon[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['16', '32'])
  const [isLoading, setIsLoading] = useState(false)

  const handleDrop = useCallback((files: File[]) => {
    const file = files[0]
    if (file) {
      setSourceFile(file)
      const url = URL.createObjectURL(file)
      setSourceUrl(url)
      setGeneratedFiles([]) // Clear previous results
    }
  }, [])

  const generateFavicons = useCallback(() => {
    if (!sourceFile) {
      toast.error('Please upload an image first.')
      return
    }

    onActionMellowtel(async () => {
      setIsLoading(true)
      const sizesToGenerate = selectedSizes.map(Number)
      const image = document.createElement('img')
      image.src = sourceUrl

      image.onload = async () => {
        const promises = sizesToGenerate.map((size) => {
          return new Promise<GeneratedFavicon>((resolve) => {
            const canvas = document.createElement('canvas')
            canvas.width = size
            canvas.height = size
            const ctx = canvas.getContext('2d')
            ctx?.drawImage(image, 0, 0, size, size)
            canvas.toBlob((blob) => {
              if (blob) {
                resolve({
                  size,
                  blob,
                  url: URL.createObjectURL(blob),
                })
              }
            }, 'image/png')
          })
        })
        const results = await Promise.all(promises)
        setGeneratedFiles(results)
        setIsLoading(false)
        toast.success('Favicons generated successfully!')
      }
      image.onerror = () => {
        toast.error('Failed to load the source image.')
        setIsLoading(false)
      }
    })
  }, [sourceFile, sourceUrl, selectedSizes])

  const handleDownloadAll = useCallback(async () => {
    const zip = new JSZip()
    generatedFiles.forEach((file) => {
      zip.file(`favicon-${file.size}x${file.size}.png`, file.blob)
    })
    const content = await zip.generateAsync({ type: 'blob' })
    FileSaver.saveAs(content, 'favicons.zip')
  }, [generatedFiles])

  const htmlLinks = useMemo(() => {
    return generatedFiles
      .map(
        (file) =>
          `<link rel="icon" type="image/png" sizes="${file.size}x${file.size}" href="/favicon-${file.size}x${file.size}.png">`,
      )
      .join('\n')
  }, [generatedFiles])

  return (
    <LayoutTool>
      <Stack>
        <Title order={4} ta="center">
          Favicon Generator
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Create favicons for your website from a single image in all necessary
          sizes.
        </Text>

        <Card withBorder p="xl" radius="md">
          <Grid align="flex-start">
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Stack>
                <Dropzone
                  onDrop={handleDrop}
                  accept={IMAGE_MIME_TYPE}
                  maxFiles={1}
                >
                  <Group justify="center" gap="xl" mih={120}>
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
                        Drag image here or click
                      </Text>
                      <Text size="sm" c="dimmed" inline mt={7}>
                        A square image (e.g., 512x512) works best.
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
                {sourceUrl && (
                  <Paper withBorder p="xs" radius="md">
                    <Text size="sm" fw={500} mb="xs">
                      Source Image
                    </Text>
                    <Image src={sourceUrl} width={80} height={80} />
                  </Paper>
                )}
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Checkbox.Group
                label="Select Favicon Sizes"
                value={selectedSizes}
                onChange={setSelectedSizes}
              >
                <SimpleGrid cols={{ base: 3, sm: 4 }} mt="xs">
                  {FAVICON_SIZES.map((size) => (
                    <Checkbox
                      key={size}
                      value={String(size)}
                      label={`${size}x${size}`}
                    />
                  ))}
                </SimpleGrid>
              </Checkbox.Group>
              <Button
                mt="xl"
                fullWidth
                onClick={generateFavicons}
                loading={isLoading}
                disabled={!sourceFile}
                leftSection={<Icon icon="tabler:hammer" />}
              >
                Generate Favicons
              </Button>
            </Grid.Col>
          </Grid>
        </Card>

        {generatedFiles.length > 0 && (
          <Card withBorder mt="lg">
            <Title order={5}>Generated Favicons</Title>
            <SimpleGrid cols={{ base: 4, sm: 6, lg: 8 }} my="md">
              {generatedFiles.map((file) => (
                <Stack key={file.size} align="center">
                  <Image src={file.url} w={48} h={48} fit="contain" />
                  <Text size="xs">{`${file.size}x${file.size}`}</Text>
                </Stack>
              ))}
            </SimpleGrid>
            <Button
              onClick={handleDownloadAll}
              variant="light"
              leftSection={<Icon icon="tabler:download" />}
            >
              Download All as .zip
            </Button>
            <Title order={5} mt="xl" mb="xs">
              HTML Links
            </Title>
            <Card withBorder p={0}>
              <Code block>{htmlLinks}</Code>
              <Group justify="flex-end" p="xs">
                <CopyButton value={htmlLinks}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied!' : 'Copy Links'}>
                      <Button size="xs" variant="default" onClick={copy}>
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>
            </Card>
          </Card>
        )}
      </Stack>
    </LayoutTool>
  )
}

export default FaviconGenerator
