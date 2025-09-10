// src/features/generator/SitemapXmlGenerator.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import { onActionMellowtel } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  Code,
  CopyButton,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import dayjs from 'dayjs'
import FileSaver from 'file-saver'
import React, { useMemo } from 'react'

const SitemapXmlGenerator: React.FC = () => {
  const form = useForm({
    initialValues: {
      urls: [
        {
          loc: 'https://example.com/',
          lastmod: new Date(),
          changefreq: 'daily',
          priority: 0.8,
        },
      ],
    },
  })

  const generatedXml = useMemo(() => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    form.values.urls.forEach((url) => {
      if (!url.loc) return
      xml += '  <url>\n'
      xml += `    <loc>${url.loc}</loc>\n`
      if (url.lastmod) {
        xml += `    <lastmod>${dayjs(url.lastmod).format('YYYY-MM-DD')}</lastmod>\n`
      }
      if (url.changefreq) {
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`
      }
      if (url.priority) {
        xml += `    <priority>${url.priority}</priority>\n`
      }
      xml += '  </url>\n'
    })
    xml += '</urlset>'
    return xml
  }, [form.values.urls])

  const handleDownload = () => {
    onActionMellowtel(() => {
      const blob = new Blob([generatedXml], {
        type: 'application/xml;charset=utf-8',
      })
      FileSaver.saveAs(blob, 'sitemap.xml')
    })
  }

  const urlFields = form.values.urls.map((_, index) => (
    <Card withBorder key={index} mt="md">
      <Group justify="space-between">
        <Text fw={500}>URL #{index + 1}</Text>
        <ActionIcon
          color="red"
          onClick={() => form.removeListItem('urls', index)}
        >
          <Icon icon="tabler:trash" />
        </ActionIcon>
      </Group>
      <Stack mt="sm">
        <TextInput
          label="URL Location (loc)"
          placeholder="https://example.com/page"
          required
          {...form.getInputProps(`urls.${index}.loc`)}
        />
        <DatePickerInput
          label="Last Modified (lastmod)"
          {...form.getInputProps(`urls.${index}.lastmod`)}
        />
        <Group grow>
          <Select
            label="Change Frequency (changefreq)"
            data={[
              'always',
              'hourly',
              'daily',
              'weekly',
              'monthly',
              'yearly',
              'never',
            ]}
            {...form.getInputProps(`urls.${index}.changefreq`)}
          />
          <NumberInput
            label="Priority"
            min={0}
            max={1}
            step={0.1}
            {...form.getInputProps(`urls.${index}.priority`)}
          />
        </Group>
      </Stack>
    </Card>
  ))

  return (
    <LayoutTool width={1000}>
      <Stack>
        <Title order={4} ta="center">
          Sitemap.xml Generator
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Easily create an XML sitemap to help search engines crawl your
          website.
        </Text>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            {urlFields}
            <Button
              mt="md"
              fullWidth
              variant="light"
              onClick={() =>
                form.insertListItem('urls', {
                  loc: '',
                  lastmod: new Date(),
                  changefreq: 'monthly',
                  priority: 0.5,
                })
              }
            >
              Add URL
            </Button>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p={0} h="100%">
              <Group justify="space-between" p="md">
                <Title order={5}>Generated sitemap.xml</Title>
                <Group>
                  <CopyButton value={generatedXml}>
                    {({ copied, copy }) => (
                      <ActionIcon
                        variant="light"
                        onClick={() => onActionMellowtel(copy)}
                      >
                        <Icon icon={copied ? 'tabler:check' : 'tabler:copy'} />
                      </ActionIcon>
                    )}
                  </CopyButton>
                  <ActionIcon variant="light" onClick={handleDownload}>
                    <Icon icon="tabler:download" />
                  </ActionIcon>
                </Group>
              </Group>
              <Code
                block
                style={{ margin: 0, borderRadius: 0, height: '100%' }}
              >
                {generatedXml}
              </Code>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </LayoutTool>
  )
}

export default SitemapXmlGenerator
