// src/tabs/resource-page.tsx
// English: This file provides promotional materials for the Chrome Web Store listing.
import PromoIcon from '@/components/Promo/PromoIcon'
import ScreenshotWrapper from '@/components/Promo/ScreenshotWrapper'
import theme from '@/libs/theme'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Center,
  Code,
  Container,
  CopyButton,
  Grid,
  Group,
  MantineProvider,
  Paper,
  Stack,
  Tabs,
  Text,
  Textarea,
  ThemeIcon,
  Title,
} from '@mantine/core'
import '@mantine/core/styles.css'
import 'mantine-datatable/styles.layer.css'
import React from 'react'

// English: Using a red gradient for a bold and energetic look.
const PROMO_GRADIENT_BACKGROUND =
  'linear-gradient(135deg, var(--mantine-color-red-8), var(--mantine-color-orange-8))'

// --- Marquee Promo Tile (1280x800px) ---
const MarqueeTileFeatureShowcase = () => (
  <Paper
    w={1280}
    h={800}
    withBorder
    radius="lg"
    p={60}
    style={{
      background: PROMO_GRADIENT_BACKGROUND,
    }}
  >
    <Stack h="100%" justify="center">
      <Grid align="center">
        <Grid.Col span={5}>
          <Stack>
            <ThemeIcon
              size={100}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'red', to: 'orange' }}
            >
              <Icon icon="tabler:cut" fontSize={60} />
            </ThemeIcon>
            <Title fz={48} lh={1.2} c="white">
              {' '}
              PDF Split & Toolkit{' '}
            </Title>
            <Title order={1} c="white" fw={500} mt="md">
              {' '}
              Split, extract, and manage your PDF pages securely in your
              browser. No uploads, no waiting.{' '}
            </Title>
          </Stack>
        </Grid.Col>
        <Grid.Col span={6}>
          <Stack gap="lg">
            <Card withBorder shadow="lg" p="lg">
              <Group>
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: 'red', to: 'orange' }}
                  radius="xl"
                  size={60}
                >
                  <Icon icon="tabler:list-numbers" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Split by Range{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                Extract specific pages or create new documents from custom
                ranges.{' '}
              </Title>
            </Card>
            <Card withBorder shadow="lg" p="lg">
              <Group>
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: 'red', to: 'orange' }}
                  radius="xl"
                  size={60}
                >
                  <Icon icon="tabler:columns-3" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Fixed Page Splitting{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                Automatically split your PDF into separate files every N pages.{' '}
              </Title>
            </Card>
            <Card withBorder shadow="lg" p="lg">
              <Group>
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: 'red', to: 'orange' }}
                  radius="xl"
                  size={60}
                >
                  <Icon icon="tabler:shield-lock" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Secure & Private{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                All processing happens on your device.{' '}
              </Title>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  </Paper>
)

// --- Reusable Marquee Tile for Feature Details ---
interface MarqueeTileFeatureDetailProps {
  icon: string
  title: string
  description: string
  featureComponent: React.ReactNode
}
const MarqueeTileFeatureDetail: React.FC<MarqueeTileFeatureDetailProps> = ({
  icon,
  title,
  description,
  featureComponent,
}) => (
  <Paper
    w={1280}
    h={800}
    withBorder
    radius="lg"
    p={60}
    style={{
      background: PROMO_GRADIENT_BACKGROUND,
    }}
  >
    <Stack h="100%" justify="center">
      <Grid align="center">
        <Grid.Col span={4}>
          <Stack>
            <ThemeIcon size={90} radius="lg">
              <Icon icon={icon} fontSize={60} />
            </ThemeIcon>
            <Title order={1} fz={50} lh={1.2} c="white">
              {' '}
              {title}{' '}
            </Title>
            <Title order={2} fw={500} c="gray.1" mt="md">
              {' '}
              {description}{' '}
            </Title>
          </Stack>
        </Grid.Col>
        <Grid.Col span={7} offset={1}>
          <Center h="100%">{featureComponent}</Center>
        </Grid.Col>
      </Grid>
    </Stack>
  </Paper>
)

const ScreenshotGallery: React.FC = () => {
  const screenshotData = [
    {
      title: 'Marquee Promo Tile: Feature Showcase (1280x800)',
      filename: 'marquee_promo_tile_pdf_split.png',
      component: <MarqueeTileFeatureShowcase />,
    },
  ]

  return (
    <Stack>
      <Text c="dimmed" mb="md">
        {' '}
        Generate and download high-resolution promotional assets for the Chrome
        Web Store.{' '}
      </Text>
      <Stack gap="xl">
        {screenshotData.map((item) => (
          <ScreenshotWrapper
            key={item.title}
            title={item.title}
            filename={item.filename}
          >
            {item.component}
          </ScreenshotWrapper>
        ))}
      </Stack>
    </Stack>
  )
}

const ResourcePage = () => {
  const storeListingText = {
    titles: [
      'PDF Split - Extract Pages from PDFs',
      'Simple PDF Splitter & Toolkit',
      'Split PDF Files Offline',
    ],
    shortDescriptions: [
      'The easiest way to split a PDF into multiple files. Extract page ranges or split every N pages. Works securely in your browser. No server uploads.',
      'Split any PDF document into separate files with a simple drag-and-drop interface. Works offline for 100% privacy and security.',
      'Stop using slow websites. Split, extract, and manage your PDF pages instantly and securely right from your browser.',
    ],
    longDescription: `⚙️ The Easiest Way to Split Your PDFs
Tired of large, unwieldy PDF files? With PDF Splitter & Toolkit, you can break down any PDF document into smaller, separate files with just a few clicks. Best of all, it works entirely offline, right in your browser, ensuring your documents are always secure and private.

✨ Key Features
- **Effortless Splitting**: Simply drag and drop the PDF file you want to split.
- **Flexible Splitting Modes**:
    - **Custom Ranges**: Extract specific pages or create a new PDF from a range (e.g., pages 5-10, 15).
    - **Fixed Ranges**: Automatically divide the document into multiple files of a set page length (e.g., split every 2 pages).
- **100% Secure & Private**: Your files are never uploaded to a server. All processing happens locally on your own computer. Your privacy is guaranteed.
- **Fast & Lightweight**: No more waiting for files to upload or download. Splitting is almost instantaneous.
- **No File Limits**: Split large files without restrictions on the number of pages.

🚀 Pro Features - Unlock the Full Toolkit!
Upgrade to Pro for a complete set of PDF tools:
- **Merge PDF**: Combine multiple PDF files into one.
- **Compress PDF**: Reduce the file size of your PDFs to make them easier to email and store.
- **Rotate Pages**: Quickly fix the orientation of individual pages.
- **Unlimited Access**: Get lifetime access to all current and future tools with a single purchase.

🤔 Who Is This For?
- **Students & Researchers**: Extract specific chapters from textbooks or relevant sections from research papers.
- **Business Professionals**: Separate invoices, reports, or contracts into individual documents for easy sharing.
- **Legal & Administrative Staff**: Isolate specific pages from large case files or official documents securely.
- **Anyone Needing to Organize PDFs**: A simple tool for anyone who wants to manage and declutter their digital documents.

Upgrade your workflow today. Stop relying on insecure online tools and take control of your documents!`,
  }

  const justificationTexts = {
    singlePurpose: `The extension's single purpose is to provide users with tools to manage PDF files directly in their browser. All features—including splitting documents by custom ranges, splitting by fixed intervals, and extracting pages—are directly tied to this core function of offline PDF manipulation.`,
    storage: `The 'storage' permission is used to locally store user settings and license information. This includes the user's license key for Pro features and an instance ID for license management. This data is kept on the user's device to ensure a consistent experience without needing a remote server.`,
    scripting: `Content scripts are essential for the extension's functionality, allowing it to provide a seamless user experience for file handling and processing within the browser environment.`,
  }

  const keywords = [
    'split pdf',
    'extract pdf pages',
    'pdf splitter',
    'pdf cutter',
    'offline pdf tool',
    'secure pdf split',
    'pdf page extractor',
    'pdf utility',
    'separate pdf pages',
    'pdf toolkit',
    'pdf page separator',
    'break pdf',
  ]
  const keywordsString = keywords.join(', ')

  return (
    <MantineProvider theme={theme}>
      <Container size="lg" py="xl">
        <Stack gap="xl">
          <Title order={1} ta="center">
            {' '}
            Chrome Web Store - Promotional Resources{' '}
          </Title>
          <Text c="dimmed" ta="center">
            {' '}
            Use these assets and text to create your store listing page.{' '}
          </Text>
          <Tabs defaultValue="screenshots">
            <Tabs.List grow>
              <Tabs.Tab
                value="text"
                leftSection={<Icon icon="tabler:file-text" />}
              >
                {' '}
                Store Listing Text{' '}
              </Tabs.Tab>
              <Tabs.Tab
                value="icons"
                leftSection={<Icon icon="tabler:photo" />}
              >
                {' '}
                Promotional Icons{' '}
              </Tabs.Tab>
              <Tabs.Tab
                value="screenshots"
                leftSection={<Icon icon="tabler:camera" />}
              >
                {' '}
                Screenshots & Tiles{' '}
              </Tabs.Tab>
              <Tabs.Tab
                value="keywords"
                leftSection={<Icon icon="tabler:tags" />}
              >
                {' '}
                Keywords (SEO){' '}
              </Tabs.Tab>
              <Tabs.Tab
                value="privacy"
                leftSection={<Icon icon="tabler:shield-lock" />}
              >
                {' '}
                Privacy Justifications{' '}
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="text" pt="lg">
              <Stack gap="xl">
                <Stack>
                  <Title order={3}>Titles</Title>
                  {storeListingText.titles.map((title, index) => (
                    <Card withBorder radius="md" key={index}>
                      <Group justify="space-between">
                        <Text fw={500}>Option {index + 1}</Text>
                        <Text
                          size="sm"
                          c={title.length > 30 ? 'red' : 'dimmed'}
                        >
                          {' '}
                          {title.length} / 30 chars{' '}
                        </Text>
                      </Group>
                      <Group mt="sm" justify="space-between">
                        <Code>{title}</Code>
                        <CopyButton value={title}>
                          {({ copied, copy }) => (
                            <Button
                              size="xs"
                              color={copied ? 'teal' : 'gray'}
                              onClick={copy}
                            >
                              {' '}
                              {copied ? 'Copied' : 'Copy'}{' '}
                            </Button>
                          )}
                        </CopyButton>
                      </Group>
                    </Card>
                  ))}
                </Stack>
                <Stack>
                  <Title order={3}>Short Descriptions</Title>
                  {storeListingText.shortDescriptions.map((desc, index) => (
                    <Card withBorder radius="md" key={index}>
                      <Group justify="space-between">
                        <Text fw={500}>Option {index + 1}</Text>
                        <Text
                          size="sm"
                          c={desc.length > 132 ? 'red' : 'dimmed'}
                        >
                          {' '}
                          {desc.length} / 132 chars{' '}
                        </Text>
                      </Group>
                      <Textarea
                        mt="sm"
                        readOnly
                        value={desc}
                        autosize
                        maxRows={4}
                      />
                      <Group justify="flex-end" mt="sm">
                        <CopyButton value={desc}>
                          {({ copied, copy }) => (
                            <Button
                              size="xs"
                              color={copied ? 'teal' : 'gray'}
                              onClick={copy}
                            >
                              {' '}
                              {copied ? 'Copied' : 'Copy'}{' '}
                            </Button>
                          )}
                        </CopyButton>
                      </Group>
                    </Card>
                  ))}
                </Stack>
                <Card withBorder radius="md">
                  <Title order={3}>Detailed Description</Title>
                  <Textarea
                    mt="sm"
                    readOnly
                    value={storeListingText.longDescription}
                    autosize
                    minRows={15}
                  />
                  <Group justify="flex-end" mt="sm">
                    <CopyButton value={storeListingText.longDescription}>
                      {({ copied, copy }) => (
                        <Button
                          size="xs"
                          color={copied ? 'teal' : 'gray'}
                          onClick={copy}
                        >
                          {' '}
                          {copied ? 'Copied' : 'Copy'}{' '}
                        </Button>
                      )}
                    </CopyButton>
                  </Group>
                </Card>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="icons" pt="lg">
              <Center>
                <ScreenshotWrapper
                  title="Promotional Icon (128x128)"
                  filename="icon_128.png"
                >
                  <PromoIcon
                    size={128}
                    icon={'tabler:cut'}
                    gradient={{ from: 'red', to: 'orange' }}
                  />
                </ScreenshotWrapper>
              </Center>
            </Tabs.Panel>

            <Tabs.Panel value="screenshots" pt="lg">
              <ScreenshotGallery />
            </Tabs.Panel>

            <Tabs.Panel value="keywords" pt="lg">
              <Card withBorder radius="md">
                <Group justify="space-between">
                  <Title order={3}>Keywords for Store Listing</Title>
                  <CopyButton value={keywordsString}>
                    {({ copied, copy }) => (
                      <Button
                        size="xs"
                        color={copied ? 'teal' : 'gray'}
                        onClick={copy}
                        leftSection={<Icon icon="tabler:copy" />}
                      >
                        {' '}
                        {copied ? 'Copied All' : 'Copy All'}{' '}
                      </Button>
                    )}
                  </CopyButton>
                </Group>
                <Text c="dimmed" size="sm" mt="xs">
                  {' '}
                  Use these keywords in your store listing's metadata to improve
                  search visibility.{' '}
                </Text>
                <Paper withBorder p="md" mt="md" radius="sm">
                  <Group gap="xs">
                    {keywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="light"
                        color="gray"
                        size="lg"
                      >
                        {' '}
                        {keyword}{' '}
                      </Badge>
                    ))}
                  </Group>
                </Paper>
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="privacy" pt="lg">
              <Stack gap="xl">
                <Card withBorder radius="md">
                  <Group justify="space-between">
                    <Title order={4}>Single Purpose Justification</Title>
                    <CopyButton value={justificationTexts.singlePurpose}>
                      {({ copied, copy }) => (
                        <Button
                          size="xs"
                          color={copied ? 'teal' : 'gray'}
                          onClick={copy}
                        >
                          {' '}
                          {copied ? 'Copied' : 'Copy'}{' '}
                        </Button>
                      )}
                    </CopyButton>
                  </Group>
                  <Textarea
                    mt="sm"
                    readOnly
                    value={justificationTexts.singlePurpose}
                    autosize
                    minRows={4}
                  />
                </Card>
                <Card withBorder radius="md">
                  <Group justify="space-between">
                    <Title order={4}>Storage Permission Justification</Title>
                    <CopyButton value={justificationTexts.storage}>
                      {({ copied, copy }) => (
                        <Button
                          size="xs"
                          color={copied ? 'teal' : 'gray'}
                          onClick={copy}
                        >
                          {' '}
                          {copied ? 'Copied' : 'Copy'}{' '}
                        </Button>
                      )}
                    </CopyButton>
                  </Group>
                  <Textarea
                    mt="sm"
                    readOnly
                    value={justificationTexts.storage}
                    autosize
                    minRows={5}
                  />
                </Card>
                <Card withBorder radius="md">
                  <Group justify="space-between">
                    <Title order={4}>Content Scripting Justification</Title>
                    <CopyButton value={justificationTexts.scripting}>
                      {({ copied, copy }) => (
                        <Button
                          size="xs"
                          color={copied ? 'teal' : 'gray'}
                          onClick={copy}
                        >
                          {' '}
                          {copied ? 'Copied' : 'Copy'}{' '}
                        </Button>
                      )}
                    </CopyButton>
                  </Group>
                  <Textarea
                    mt="sm"
                    readOnly
                    value={justificationTexts.scripting}
                    autosize
                    minRows={5}
                  />
                </Card>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>
    </MantineProvider>
  )
}

export default ResourcePage
