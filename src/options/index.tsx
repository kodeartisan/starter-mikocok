// src/options/index.tsx
import mellowtel from '@/libs/mellowtel'
import theme from '@/libs/theme'
import toast from '@/utils/toast'
import {
  Card,
  Center,
  Container,
  MantineProvider,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import React, { useCallback, useEffect, useState } from 'react'

const PageOptions: React.FC = () => {
  // State to track if the user is currently opted in and the loading status.
  const [isOptedIn, setIsOptedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Memoized function to fetch the current Mellowtel status.
  const fetchStatus = useCallback(async () => {
    try {
      const mellowtelInstance = mellowtel.getMellowtel()
      const status = await mellowtelInstance.getOptInStatus()
      setIsOptedIn(status)
    } catch (error) {
      console.error('Failed to fetch Mellowtel status:', error)
      toast.error('Could not load your support status.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch the initial status when the component mounts.
  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  // Handles the toggle action for opting in or out.
  const handleToggle = async (checked: boolean) => {
    setIsLoading(true)
    try {
      const mellowtelInstance = mellowtel.getMellowtel()
      if (checked) {
        await mellowtelInstance.optIn()
        await mellowtelInstance.start()
        toast.success('Thank you for your support!')
      } else {
        await mellowtelInstance.optOut()
        toast.info('Support has been deactivated.')
      }
      // Refresh the status from the source of truth.
      await fetchStatus()
    } catch (error) {
      console.error('Failed to update Mellowtel status:', error)
      toast.error('An error occurred. Please try again.')
      // Revert UI on failure
      setIsLoading(false)
    }
  }

  return (
    <MantineProvider theme={theme}>
      <Center mt={'xl'}>
        <Container size={'md'}>
          <Stack gap="xl">
            <Title order={2} ta="center">
              Settings
            </Title>
            <Card withBorder p="xl" radius="md">
              <Stack>
                <Title order={4}>Support Independent Development</Title>
                <Text c="dimmed" size="sm">
                  As a small team, your contribution is vital. It allows us to
                  continue developing and improving this extension. By enabling
                  this, you agree to the Mellowtel terms. This process is 100%
                  private, has zero impact on your speed, and you can opt-out at
                  any time.
                </Text>

                <a
                  href="https://www.mellowtel.it/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 'var(--mantine-font-size-sm)',
                    textDecoration: 'underline',
                    color: 'var(--mantine-color-anchor)',
                  }}
                >
                  Learn More
                </a>

                <Switch
                  checked={isOptedIn}
                  onChange={(event) =>
                    handleToggle(event.currentTarget.checked)
                  }
                  disabled={isLoading}
                  label={
                    isOptedIn
                      ? 'Support is currently active'
                      : 'Support is currently inactive'
                  }
                  size="md"
                  mt="md"
                />
              </Stack>
            </Card>
          </Stack>
        </Container>
      </Center>
    </MantineProvider>
  )
}

export default PageOptions
