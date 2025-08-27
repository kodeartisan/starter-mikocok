// src/components/Modal/ModalMellowtel.tsx
import Modal from '@/components/Modal/Modal'
import mellowtel from '@/libs/mellowtel'
import { Icon } from '@iconify/react'
import {
  Button,
  Group,
  List,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import React from 'react'

interface Props {
  opened: boolean
  onClose: () => void
}

const BenefitListItem = ({
  icon,
  title,
  children,
}: {
  icon: string
  title: string
  children: React.ReactNode
}) => (
  <List.Item
    icon={
      <ThemeIcon color="teal" size={24} radius="xl">
        <Icon icon={icon} fontSize={16} />
      </ThemeIcon>
    }
  >
    <Text size="sm" fw={700}>
      {title}
    </Text>
    <Text size="sm" c="dimmed">
      {children}
    </Text>
  </List.Item>
)

const ModalMellowtel: React.FC<Props> = ({ opened, onClose }) => {
  const handleActivate = async () => {
    const getMellowtel = mellowtel.getMellowtel()
    await getMellowtel.optIn()
    await getMellowtel.start()
    onClose()
  }

  return (
    <Modal opened={opened} onClose={onClose} w={600} withCloseButton={false}>
      <Stack px="md">
        <Group>
          {/* MODIFIED: Changed icon to better represent partnership and support. */}
          <ThemeIcon size="lg" variant="light" radius="md">
            <Icon icon="tabler:heart-handshake" fontSize={24} />
          </ThemeIcon>
          {/* MODIFIED: Title is now more focused on the user's impact. */}
          <Title order={3}>Your Support Makes a Difference</Title>
        </Group>

        {/* MODIFIED: Description is more personal, explaining why their help is needed. */}
        <Text c="dimmed" size="sm" mt={-10} mb="md">
          As a small team, your contribution is vital. It allows us to continue
          developing and improving this extension.
        </Text>

        <Title order={5}>How You'll Help</Title>
        <List spacing="sm" size="sm" center>
          <BenefitListItem
            icon="tabler:rocket"
            title="Sustain Independent Development"
          >
            Your support directly funds our efforts to maintain and build new
            features.
          </BenefitListItem>
        </List>

        <Title order={5} mt="md">
          Safe & Secure for You
        </Title>
        <List spacing="sm" size="sm" center>
          <BenefitListItem
            icon="tabler:shield-lock"
            title="100% Private & Anonymous"
          >
            No personal data or browsing history is ever collected.
          </BenefitListItem>
          <BenefitListItem
            icon="tabler:gauge"
            title="Zero Impact on Your Speed"
          >
            This process runs only when your device is idle.
          </BenefitListItem>
          <BenefitListItem icon="tabler:settings" title="You Are In Control">
            You can pause or opt-out at any time from the extension's settings.
          </BenefitListItem>
        </List>

        <Text size="xs" c="dimmed" mt="md">
          By activating, you agree to the Mellowtel terms.{' '}
          <a
            href="https://www.mellowtel.it/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginLeft: 4,
              textDecoration: 'underline',
              color: 'var(--mantine-color-anchor)',
            }}
          >
            Learn More
          </a>
        </Text>

        <Group justify="flex-end">
          {/* MODIFIED: Button text is more enthusiastic and action-oriented. */}
          <Button size="sm" onClick={handleActivate}>
            Yes, I Want to Help!
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ModalMellowtel
