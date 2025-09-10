// src/features/validator/XmlValidator.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import { onActionMellowtel } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  Alert,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useState } from 'react'

interface ValidationResult {
  isValid: boolean
  message: string
}

const XmlValidator: React.FC = () => {
  const [result, setResult] = useState<ValidationResult | null>(null)
  const form = useForm({
    initialValues: {
      input: '',
    },
  })

  const handleSubmit = (values: { input: string }) => {
    onActionMellowtel(() => {
      if (!values.input) {
        setResult(null)
        return
      }
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(values.input, 'application/xml')
        const errorNode = doc.querySelector('parsererror')

        if (errorNode) {
          setResult({
            isValid: false,
            message: errorNode.textContent || 'Unknown parsing error.',
          })
        } else {
          setResult({
            isValid: true,
            message: 'XML is valid and well-formed.',
          })
        }
      } catch (error: any) {
        setResult({ isValid: false, message: error.message })
      }
    })
  }

  const handleClear = () => {
    form.reset()
    setResult(null)
  }

  return (
    <LayoutTool>
      <Stack>
        <Title order={4} ta="center">
          XML Validator
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Check your XML data for syntax errors and ensure it's well-formed.
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Textarea
              label="XML Input"
              placeholder="Paste your XML here to validate..."
              autosize
              minRows={10}
              styles={{ input: { fontFamily: 'monospace' } }}
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
            <Card withBorder>
              <Group justify="space-between">
                <Button type="submit">Validate</Button>
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

export default XmlValidator
