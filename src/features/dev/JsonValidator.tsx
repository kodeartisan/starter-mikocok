// src/features/Generator/JsonValidator.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import { onActionMellowtel } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Group,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React from 'react'

interface ValidationResult {
  isValid: boolean
  message: string
  beautified?: string
}

const JsonValidator: React.FC = () => {
  const [result, setResult] = React.useState<ValidationResult | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm({
    initialValues: {
      input: '',
      beautify: true,
    },
  })

  const handleSubmit = async (values: typeof form.values) => {
    await onActionMellowtel(() => {
      if (!values.input) {
        setResult(null)
        return
      }
      setIsLoading(true)
      try {
        const parsed = JSON.parse(values.input)
        const beautified = values.beautify
          ? JSON.stringify(parsed, null, 2)
          : undefined
        setResult({
          isValid: true,
          message: 'JSON is valid and well-formed.',
          beautified,
        })
      } catch (error: any) {
        setResult({ isValid: false, message: error.message })
      } finally {
        setIsLoading(false)
      }
    })
  }

  const handleClear = () => {
    form.setValues({ input: '', beautify: true })
    setResult(null)
  }

  return (
    <LayoutTool>
      <Stack>
        <Title order={4} ta="center">
          JSON Validator
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Check your JSON data for syntax errors and get a formatted version if
          it's valid.
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Textarea
              label="JSON Input"
              placeholder="Paste your JSON here to validate..."
              autosize
              minRows={10}
              maxRows={15}
              styles={{ input: { fontFamily: 'monospace', fontSize: 14 } }}
              {...form.getInputProps('input')}
            />

            {result && (
              <Alert
                title={
                  result.isValid ? 'Validation Success' : 'Validation Failed'
                }
                color={result.isValid ? 'teal' : 'red'}
                icon={
                  result.isValid ? (
                    <Icon icon="tabler:check" />
                  ) : (
                    <Icon icon="tabler:alert-triangle" />
                  )
                }
              >
                {result.message}
              </Alert>
            )}

            {result?.isValid && result.beautified && (
              <Textarea
                label="Beautified JSON"
                readOnly
                autosize
                minRows={10}
                maxRows={15}
                value={result.beautified}
                styles={{ input: { fontFamily: 'monospace', fontSize: 14 } }}
              />
            )}

            <Card withBorder>
              <Group justify="space-between">
                <Button
                  type="submit"
                  leftSection={<Icon icon="tabler:analyze" />}
                  loading={isLoading}
                >
                  Validate
                </Button>
                <Checkbox
                  label="Beautify if valid"
                  {...form.getInputProps('beautify', { type: 'checkbox' })}
                />
                <Button
                  variant="light"
                  color="red"
                  onClick={handleClear}
                  disabled={!form.values.input && !result}
                >
                  Clear
                </Button>
              </Group>
            </Card>
          </Stack>
        </form>
      </Stack>
    </LayoutTool>
  )
}

export default JsonValidator
