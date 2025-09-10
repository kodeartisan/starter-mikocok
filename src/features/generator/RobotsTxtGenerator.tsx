// src/features/generator/RobotsTxtGenerator.tsx
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
  SegmentedControl,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import FileSaver from 'file-saver'
import React, { useMemo } from 'react'

const RobotsTxtGenerator: React.FC = () => {
  const form = useForm({
    initialValues: {
      defaultPolicy: 'allow',
      sitemapUrl: '',
      rules: [{ userAgent: '*', disallow: '/', allow: '' }],
    },
  })

  const generatedTxt = useMemo(() => {
    let content = ''
    form.values.rules.forEach((rule) => {
      content += `User-agent: ${rule.userAgent || '*'}\n`
      if (form.values.defaultPolicy === 'disallow' && !rule.disallow) {
        content += 'Disallow: /\n'
      }
      if (rule.disallow) {
        rule.disallow
          .split('\n')
          .forEach((path) => (content += `Disallow: ${path.trim()}\n`))
      }
      if (rule.allow) {
        rule.allow
          .split('\n')
          .forEach((path) => (content += `Allow: ${path.trim()}\n`))
      }
      content += '\n'
    })

    if (form.values.sitemapUrl) {
      content += `Sitemap: ${form.values.sitemapUrl}\n`
    }
    return content
  }, [form.values])

  const handleDownload = () => {
    onActionMellowtel(() => {
      const blob = new Blob([generatedTxt], {
        type: 'text/plain;charset=utf-8',
      })
      FileSaver.saveAs(blob, 'robots.txt')
    })
  }

  const ruleFields = form.values.rules.map((_, index) => (
    <Card withBorder key={index} mt="md">
      <Group justify="space-between">
        <Text fw={500}>Rule #{index + 1}</Text>
        <ActionIcon
          color="red"
          onClick={() => form.removeListItem('rules', index)}
        >
          <Icon icon="tabler:trash" />
        </ActionIcon>
      </Group>
      <TextInput
        mt="sm"
        label="User-Agent"
        placeholder="e.g., * or Googlebot"
        {...form.getInputProps(`rules.${index}.userAgent`)}
      />
      <Textarea
        mt="sm"
        label="Disallow"
        placeholder="Paths to block, one per line"
        autosize
        minRows={2}
        {...form.getInputProps(`rules.${index}.disallow`)}
      />
      <Textarea
        mt="sm"
        label="Allow"
        placeholder="Paths to allow, one per line"
        autosize
        minRows={2}
        {...form.getInputProps(`rules.${index}.allow`)}
      />
    </Card>
  ))

  return (
    <LayoutTool>
      <Stack>
        <Title order={4} ta="center">
          Robots.txt Generator
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Create a `robots.txt` file to manage web crawler access to your site.
        </Text>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="xl" radius="md">
              <Stack>
                <Text fw={500}>Default Policy for All Bots</Text>
                <SegmentedControl
                  fullWidth
                  data={[
                    { label: 'Allow All', value: 'allow' },
                    { label: 'Disallow All', value: 'disallow' },
                  ]}
                  {...form.getInputProps('defaultPolicy')}
                />
                {ruleFields}
                <Button
                  mt="md"
                  variant="light"
                  onClick={() =>
                    form.insertListItem('rules', {
                      userAgent: '',
                      disallow: '',
                      allow: '',
                    })
                  }
                >
                  Add New Rule
                </Button>
                <TextInput
                  mt="lg"
                  label="Sitemap URL"
                  placeholder="https://example.com/sitemap.xml"
                  {...form.getInputProps('sitemapUrl')}
                />
              </Stack>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder p="xl" radius="md" h="100%">
              <Group justify="space-between">
                <Title order={5}>Generated robots.txt</Title>
                <Group>
                  <CopyButton value={generatedTxt}>
                    {({ copied, copy }) => (
                      <Tooltip label="Copy">
                        <ActionIcon
                          variant="light"
                          onClick={() => onActionMellowtel(copy)}
                        >
                          <Icon
                            icon={copied ? 'tabler:check' : 'tabler:copy'}
                          />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                  <Tooltip label="Download robots.txt">
                    <ActionIcon variant="light" onClick={handleDownload}>
                      <Icon icon="tabler:download" />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
              <Code block mt="md">
                {generatedTxt}
              </Code>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </LayoutTool>
  )
}

export default RobotsTxtGenerator
