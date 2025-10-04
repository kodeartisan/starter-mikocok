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
  TextInput,
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
              size={90}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'red', to: 'orange' }}
            >
              <Icon icon="tabler:file-stack" fontSize={70} />
            </ThemeIcon>
            <Title fz={48} lh={1.2} c="white">
              {' '}
              PDF Merge & Toolkit{' '}
            </Title>
            <Title order={2} c="white" fw={500} mt="md">
              {' '}
              Combine, organize, and compress your PDF files securely in your
              browser. No uploads, no waiting.{' '}
            </Title>
          </Stack>
        </Grid.Col>
        <Grid.Col span={5}>
          <Stack gap="lg">
            <Card withBorder shadow="lg" p="lg">
              <Group>
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: 'red', to: 'orange' }}
                  radius="xl"
                  size={60}
                >
                  <Icon icon="tabler:drag-drop" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Drag, Drop, Done{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                Effortlessly combine multiple PDFs.{' '}
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
                  <Icon icon="tabler:arrows-sort" fontSize={45} />
                </ThemeIcon>
                <Title order={1} fw={700}>
                  {' '}
                  Reorder & Delete{' '}
                </Title>
              </Group>
              <Title size={26} c="gray.7" fw={500} mt="md">
                {' '}
                Organize pages exactly how you want.{' '}
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

// --- Feature Mockups for Screenshots ---
const FeatureMockupPdfMergeUI = () => (
  <Card withBorder radius="md" p="xl" w={500}>
    <Stack>
      <Title order={4}>Effortless PDF Merging</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Simply drag and drop your files to start combining them instantly.{' '}
      </Text>
      <Paper
        mt="md"
        withBorder
        p="xl"
        radius="md"
        style={{ borderStyle: 'dashed' }}
      >
        <Center>
          <Stack align="center">
            <Icon icon="tabler:upload" fontSize={50} />
            <Text>Drag & drop PDF files here</Text>
            <Text size="xs" c="dimmed">
              {' '}
              or click to select files{' '}
            </Text>
          </Stack>
        </Center>
      </Paper>
      <Button mt="sm" color="red">
        Merge PDFs
      </Button>
    </Stack>
  </Card>
)

const FeatureMockupReorderPages = () => (
  <Card withBorder radius="md" p="xl" w={500}>
    <Stack>
      <Title order={4}>Organize Pages Your Way</Title>
      <Text c="dimmed" size="sm">
        {' '}
        After adding files, drag pages to reorder them before merging.{' '}
      </Text>
      <Grid mt="md" gutter="sm">
        {[1, 2, 3, 4].map((i) => (
          <Grid.Col span={6} key={i}>
            <Paper withBorder p="sm" radius="sm">
              <Stack align="center">
                <Icon icon="tabler:file-text" fontSize={40} />
                <Text size="xs">Page {i}</Text>
              </Stack>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  </Card>
)

const FeatureMockupExtraTools = () => (
  <Card withBorder radius="md" p="xl" w={500}>
    <Stack>
      <Title order={4}>More Than Just Merging (Pro)</Title>
      <Text c="dimmed" size="sm">
        {' '}
        Upgrade to unlock a full suite of PDF tools for all your needs.{' '}
      </Text>
      <Stack mt="md">
        <Button variant="default" fullWidth>
          Split PDF
        </Button>
        <Button variant="default" fullWidth>
          Compress PDF
        </Button>
        <Button variant="default" fullWidth>
          Rotate Pages
        </Button>
      </Stack>
    </Stack>
  </Card>
)

const FeatureMockupSecureProcessing = () => (
  <Card withBorder radius="md" p="xl" w={500}>
    <Stack align="center" ta="center">
      <ThemeIcon size={60} radius="xl" color="red">
        <Icon icon="tabler:shield-check" fontSize={40} />
      </ThemeIcon>
      <Title order={4} mt="sm">
        100% Private & Secure
      </Title>
      <Text c="dimmed" size="sm">
        {' '}
        Your files are never uploaded to any server. All merging and editing
        happens locally in your browser, guaranteeing your data's privacy.{' '}
      </Text>
    </Stack>
  </Card>
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
        <Grid.Col span={6}>
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
      filename: 'marquee_promo_tile_pdf_merge.png',
      component: <MarqueeTileFeatureShowcase />,
    },
    {
      title: 'Feature Screenshot: Main Interface (1280x800)',
      filename: 'feature_pdf_merge_main_ui.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:drag-drop"
          title="Drag, Drop, Merge"
          description="Combining PDFs is as simple as dragging your files into the window. Our intuitive interface makes it fast and easy."
          featureComponent={<FeatureMockupPdfMergeUI />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Reorder Pages (1280x800)',
      filename: 'feature_pdf_merge_reorder_pages.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:arrows-sort"
          title="Organize With Ease"
          description="Easily reorder pages from all your uploaded documents into a single, perfectly arranged file before you merge."
          featureComponent={<FeatureMockupReorderPages />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Pro Tools (1280x800)',
      filename: 'feature_pdf_merge_pro_tools.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:sparkles"
          title="Powerful Pro Tools"
          description="Upgrade to unlock advanced features like PDF splitting, compression to reduce file size, page rotation, and more."
          featureComponent={<FeatureMockupExtraTools />}
        />
      ),
    },
    {
      title: 'Feature Screenshot: Security First (1280x800)',
      filename: 'feature_pdf_merge_security.png',
      component: (
        <MarqueeTileFeatureDetail
          icon="tabler:shield-lock"
          title="Completely Secure & Private"
          description="Your files are never sent over the internet. All processing happens locally on your computer, ensuring your data remains yours."
          featureComponent={<FeatureMockupSecureProcessing />}
        />
      ),
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
      'PDF Merge - Combine & Edit PDFs',
      'Simple PDF Merger & Toolkit',
      'Merge PDF Files Offline',
    ],
    shortDescriptions: [
      'The easiest way to merge multiple PDF files into one. Drag, drop, reorder, and compress securely in your browser. No server uploads.',
      'Combine unlimited PDF documents with a simple drag-and-drop interface. Works offline for 100% privacy and security.',
      'Stop using slow websites. Merge, split, and compress your PDFs instantly and securely right from your browser.',
    ],
    longDescription: `⚙️ The Easiest Way to Manage Your PDFs
Tired of juggling multiple PDF files? With PDF Merge & Toolkit, you can combine countless PDF documents into a single, organized file with just a few clicks. Best of all, it works entirely offline, right in your browser, ensuring your documents are always secure and private.

✨ Key Features
- **Effortless Merging**: Simply drag and drop all the PDF files you want to combine.
- **Page Organization**: Easily reorder or delete pages from any of the uploaded files before you merge them.
- **100% Secure & Private**: Your files are never uploaded to a server. All processing happens locally on your own computer. Your privacy is guaranteed.
- **Fast & Lightweight**: No more waiting for files to upload or download. Merging is almost instantaneous.
- **No File Limits**: Merge as many files as you need, with no restrictions on the number of documents or total file size.

🚀 Pro Features - Unlock the Full Toolkit!
Upgrade to Pro for a complete set of PDF tools:
- **Split PDF**: Extract specific pages or page ranges from a PDF.
- **Compress PDF**: Reduce the file size of your PDFs to make them easier to email and store.
- **Rotate Pages**: Quickly fix the orientation of individual pages.
- **Unlimited Access**: Get lifetime access to all current and future tools with a single purchase.

🤔 Who Is This For?
- **Students & Researchers**: Combine lecture notes, research papers, and assignments into one document.
- **Business Professionals**: Merge reports, invoices, and contracts for easy sharing and archiving.
- **Legal & Administrative Staff**: Consolidate case files, forms, and official documents securely.
- **Anyone Needing to Organize PDFs**: A simple tool for anyone who wants to declutter their digital documents.

Upgrade your workflow today. Stop relying on insecure online tools and take control of your documents!`,
  }

  const justificationTexts = {
    singlePurpose: `The extension's single purpose is to provide users with tools to manage PDF files directly in their browser. All features—including merging multiple files, reordering pages, splitting documents, and compressing files—are directly tied to this core function of offline PDF manipulation.`,
    storage: `The 'storage' permission is used to locally store user settings and license information. This includes the user's license key for Pro features and an instance ID for license management. This data is kept on the user's device to ensure a consistent experience without needing a remote server.`,
    scripting: `Content scripts are essential for the extension's functionality, allowing it to provide a seamless user experience for file handling and processing within the browser environment.`,
  }

  const keywords = [
    'merge pdf',
    'combine pdf',
    'pdf joiner',
    'pdf merger',
    'offline pdf tool',
    'secure pdf merge',
    'split pdf',
    'compress pdf',
    'pdf editor extension',
    'pdf utility',
    'combine pdf files',
    'pdf toolkit',
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
                  {/* Pastikan PromoIcon dapat menerima props gradient. */}
                  {/* Jika PromoIcon tidak memiliki implementasi untuk 'gradient',
                      maka perubahan ini tidak akan berpengaruh secara visual.
                      Anda mungkin perlu memodifikasi file PromoIcon.tsx
                      untuk mendukung props ini. */}
                  <PromoIcon
                    size={128}
                    icon={'tabler:file-stack'}
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
