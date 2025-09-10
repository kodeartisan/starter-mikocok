// src/features/Generator/WordCounter.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import { onActionMellowtel } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Button,
  Card,
  Group,
  List,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React from 'react'

interface Stats {
  words: number
  characters: number
  charsNoSpaces: number
  sentences: number
  paragraphs: number
  readingTime: string // in minutes
  topWords: { word: string; count: number }[]
}

const WordCounter: React.FC = () => {
  const [stats, setStats] = React.useState<Stats | null>(null)

  const form = useForm({
    initialValues: {
      input: '',
    },
  })

  const handleSubmit = async (values: { input: string }) => {
    await onActionMellowtel(() => {
      const text = values.input.trim()
      if (!text) {
        setStats(null)
        return
      }

      const words = text.match(/\b\w+\b/g) || []
      const sentences = text.split(/[.!?]+/).filter(Boolean)
      const paragraphs = text.split(/\n+/).filter((p) => p.trim() !== '')

      // Reading time (approx. 200 WPM)
      const minutes = Math.ceil(words.length / 200)
      const readingTime = `${minutes} minute${minutes !== 1 ? 's' : ''}`

      // Top words
      const wordCounts = words
        .map((w) => w.toLowerCase())
        .reduce(
          (acc, word) => {
            acc[word] = (acc[word] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )

      const topWords = Object.entries(wordCounts)
        .sort(([, a], [, b]) => {
          //@ts-ignore
          return b - a
        })
        .slice(0, 5)
        .map(([word, count]) => ({ word, count }))

      setStats({
        words: words.length,
        characters: text.length,
        charsNoSpaces: text.replace(/\s/g, '').length,
        sentences: sentences.length,
        paragraphs: paragraphs.length,
        readingTime,
        //@ts-ignore
        topWords,
      })
    })
  }

  const handleClear = () => {
    form.setFieldValue('input', '')
    setStats(null)
  }

  return (
    <LayoutTool>
      <Stack>
        <Title order={4} ta="center">
          Word & Text Counter
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Analyze your text to get detailed statistics like word count, reading
          time, and more.
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Textarea
              label="Your Text"
              placeholder="Paste your text here..."
              autosize
              minRows={8}
              {...form.getInputProps('input')}
            />
            <Group grow>
              <Button
                type="submit"
                leftSection={<Icon icon="tabler:calculator" />}
              >
                Calculate Statistics
              </Button>
              <Button
                variant="light"
                color="red"
                onClick={handleClear}
                disabled={!form.values.input}
              >
                Clear
              </Button>
            </Group>
          </Stack>
        </form>

        {stats && (
          <Card withBorder mt="md">
            <SimpleGrid cols={{ base: 2, sm: 3 }}>
              <StatItem label="Words" value={stats.words} />
              <StatItem label="Characters" value={stats.characters} />
              <StatItem label="Sentences" value={stats.sentences} />
              <StatItem label="Paragraphs" value={stats.paragraphs} />
              <StatItem label="Reading Time" value={stats.readingTime} />
            </SimpleGrid>
            {stats.topWords.length > 0 && (
              <Stack mt="lg">
                <Title order={6}>Top Words</Title>
                <List>
                  {stats.topWords.map((item) => (
                    <List.Item key={item.word}>
                      "{item.word}" ({item.count} times)
                    </List.Item>
                  ))}
                </List>
              </Stack>
            )}
          </Card>
        )}
      </Stack>
    </LayoutTool>
  )
}

const StatItem = ({ label, value }: { label: string; value: any }) => (
  <Stack gap={0}>
    <Text size="sm" c="dimmed">
      {label}
    </Text>
    <Text fw={700} size="xl">
      {value}
    </Text>
  </Stack>
)

export default WordCounter
