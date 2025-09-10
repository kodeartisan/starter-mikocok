// src/features/generator/CssShadowGenerator.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import { onActionMellowtel } from '@/utils/util'
import {
  Button,
  Card,
  Code,
  ColorInput,
  CopyButton,
  Grid,
  Group,
  Paper,
  Slider,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useMemo } from 'react'

const CssShadowGenerator: React.FC = () => {
  const form = useForm({
    initialValues: {
      offsetX: 4,
      offsetY: 6,
      blur: 12,
      spread: 2,
      color: 'rgba(0, 0, 0, 0.15)',
      isInset: false,
    },
  })

  const generatedShadow = useMemo(() => {
    const { offsetX, offsetY, blur, spread, color, isInset } = form.values
    const inset = isInset ? 'inset ' : ''
    return `${inset}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`
  }, [form.values])

  const generatedCss = `box-shadow: ${generatedShadow};`

  return (
    <LayoutTool>
      <Stack>
        <Title order={4} ta="center">
          CSS Box-Shadow Generator
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Design and generate custom box-shadows for your CSS elements.
        </Text>
        <Grid>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Card withBorder p="xl" radius="md">
              <Stack>
                <Slider
                  label={`Offset X: ${form.values.offsetX}px`}
                  min={-50}
                  max={50}
                  {...form.getInputProps('offsetX')}
                />
                <Slider
                  label={`Offset Y: ${form.values.offsetY}px`}
                  min={-50}
                  max={50}
                  {...form.getInputProps('offsetY')}
                />
                <Slider
                  label={`Blur Radius: ${form.values.blur}px`}
                  min={0}
                  max={100}
                  {...form.getInputProps('blur')}
                />
                <Slider
                  label={`Spread Radius: ${form.values.spread}px`}
                  min={-50}
                  max={50}
                  {...form.getInputProps('spread')}
                />
                <ColorInput
                  label="Shadow Color"
                  format="rgba"
                  {...form.getInputProps('color')}
                />
                <Switch
                  label="Inset Shadow"
                  {...form.getInputProps('isInset', { type: 'checkbox' })}
                />
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Paper
                  radius="md"
                  h="100px"
                  w="100px"
                  style={{ boxShadow: generatedShadow }}
                />
              </Paper>
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

export default CssShadowGenerator
