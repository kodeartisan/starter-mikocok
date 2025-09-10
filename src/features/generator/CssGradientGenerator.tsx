// src/features/generator/CssGradientGenerator.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import { onActionMellowtel } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  Code,
  ColorInput,
  CopyButton,
  Grid,
  Group,
  Paper,
  SegmentedControl,
  Select,
  Slider,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useMemo } from 'react'

const CssGradientGenerator: React.FC = () => {
  const form = useForm({
    initialValues: {
      type: 'linear',
      angle: 145,
      color1: 'rgba(5, 150, 105, 1)',
      color2: 'rgba(163, 230, 53, 1)',
      radialShape: 'ellipse',
    },
  })

  const generatedGradient = useMemo(() => {
    const { type, angle, color1, color2, radialShape } = form.values
    if (type === 'linear') {
      return `linear-gradient(${angle}deg, ${color1}, ${color2})`
    }
    return `radial-gradient(${radialShape}, ${color1}, ${color2})`
  }, [form.values])

  const generatedCss = `background-image: ${generatedGradient};`

  return (
    <LayoutTool>
      <Stack>
        <Title order={4} ta="center">
          CSS Gradient Generator
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Visually create beautiful, custom CSS gradients for your projects.
        </Text>
        <Grid>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Card withBorder p="xl" radius="md">
              <Stack>
                <SegmentedControl
                  fullWidth
                  data={[
                    { label: 'Linear', value: 'linear' },
                    { label: 'Radial', value: 'radial' },
                  ]}
                  {...form.getInputProps('type')}
                />
                <ColorInput
                  label="Color 1"
                  format="rgba"
                  {...form.getInputProps('color1')}
                />
                <ColorInput
                  label="Color 2"
                  format="rgba"
                  {...form.getInputProps('color2')}
                />
                {form.values.type === 'linear' ? (
                  <Stack gap={4}>
                    <Text size="sm">Angle ({form.values.angle}°)</Text>
                    <Slider
                      min={0}
                      max={360}
                      {...form.getInputProps('angle')}
                    />
                  </Stack>
                ) : (
                  <Select
                    label="Shape"
                    data={['circle', 'ellipse']}
                    {...form.getInputProps('radialShape')}
                  />
                )}
              </Stack>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack h="100%">
              <Paper
                withBorder
                style={{
                  flex: 1,
                  minHeight: 200,
                  background: generatedGradient,
                }}
              />
              <Card withBorder>
                <Group justify="space-between">
                  <Text fw={500}>Generated CSS</Text>
                  <CopyButton value={generatedCss}>
                    {({ copied, copy }) => (
                      <Button
                        size="xs"
                        variant="light"
                        color={copied ? 'teal' : 'gray'}
                        onClick={() => onActionMellowtel(copy)}
                      >
                        {copied ? 'Copied!' : 'Copy CSS'}
                      </Button>
                    )}
                  </CopyButton>
                </Group>
                <Code block mt="xs">
                  {generatedCss}
                </Code>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </LayoutTool>
  )
}

export default CssGradientGenerator
