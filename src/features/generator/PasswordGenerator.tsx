// src/features/generator/PasswordGenerator.tsx
import LayoutTool from '@/components/Layout/LayoutTool'
import { onActionMellowtel } from '@/utils/util'
import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Button,
  Card,
  CopyButton,
  Group,
  Slider,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useCallback, useEffect, useState } from 'react'

const CHARS = {
  LOWER: 'abcdefghijklmnopqrstuvwxyz',
  UPPER: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  NUMBERS: '0123456789',
  SYMBOLS: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('')
  const form = useForm({
    initialValues: {
      length: 16,
      useUpper: true,
      useLower: true,
      useNumbers: true,
      useSymbols: true,
    },
  })

  const generatePassword = useCallback(() => {
    onActionMellowtel(() => {
      const { length, useUpper, useLower, useNumbers, useSymbols } = form.values
      let charset = ''
      if (useUpper) charset += CHARS.UPPER
      if (useLower) charset += CHARS.LOWER
      if (useNumbers) charset += CHARS.NUMBERS
      if (useSymbols) charset += CHARS.SYMBOLS

      if (!charset) {
        setPassword('Select at least one character type')
        return
      }

      let newPassword = ''
      for (let i = 0; i < length; i++) {
        newPassword += charset.charAt(
          Math.floor(Math.random() * charset.length),
        )
      }
      setPassword(newPassword)
    })
  }, [form.values])

  useEffect(() => {
    generatePassword()
  }, []) // Generate on initial load

  return (
    <LayoutTool>
      <Stack>
        <Title order={4} ta="center">
          Secure Password Generator
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="lg">
          Create strong, random passwords to protect your accounts.
        </Text>
        <Card withBorder p="xl" radius="md">
          <Stack>
            <Group>
              <TextInput value={password} readOnly style={{ flex: 1 }} />
              <CopyButton value={password}>
                {({ copied, copy }) => (
                  <Tooltip label="Copy Password">
                    <ActionIcon size="lg" onClick={copy} disabled={!password}>
                      <Icon icon="tabler:copy" />
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
              <Tooltip label="Regenerate">
                <ActionIcon
                  size="lg"
                  onClick={generatePassword}
                  variant="light"
                >
                  <Icon icon="tabler:reload" />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Stack gap={4} mt="md">
              <Text size="sm">Length: {form.values.length}</Text>
              <Slider min={8} max={64} {...form.getInputProps('length')} />
            </Stack>
            <Group mt="md" grow>
              <Switch
                label="Uppercase (A-Z)"
                {...form.getInputProps('useUpper', { type: 'checkbox' })}
              />
              <Switch
                label="Lowercase (a-z)"
                {...form.getInputProps('useLower', { type: 'checkbox' })}
              />
              <Switch
                label="Numbers (0-9)"
                {...form.getInputProps('useNumbers', { type: 'checkbox' })}
              />
              <Switch
                label="Symbols (!@#...)"
                {...form.getInputProps('useSymbols', { type: 'checkbox' })}
              />
            </Group>
            <Button fullWidth mt="xl" onClick={generatePassword}>
              Generate New Password
            </Button>
          </Stack>
        </Card>
      </Stack>
    </LayoutTool>
  )
}

export default PasswordGenerator
