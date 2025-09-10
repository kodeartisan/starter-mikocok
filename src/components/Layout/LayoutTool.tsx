// src/components/Layout/LayoutPage.tsx

import { Icon } from '@iconify/react'
import {
  ActionIcon,
  Box,
  Card,
  Center,
  Group,
  Menu,
  Paper,
  Stack,
  Title,
  type MantineSpacing,
  type StyleProp,
} from '@mantine/core'
import icon from 'data-base64:../../../assets/icon.png'
import browser from 'webextension-polyfill'
import packageJson from '../../../package.json'

interface Props {
  width?: StyleProp<React.CSSProperties['width']> | null
  height?: StyleProp<React.CSSProperties['height']> | null
  p?: StyleProp<MantineSpacing>
  children: React.ReactNode
}

const LayoutTool: React.FC<Props> = ({
  width = 800,
  p = 'xl',
  children,
}: Props) => {
  const renderBody = () => {
    return <Stack>{children}</Stack>
  }

  const handleOpenOptionsPage = () => {
    browser.runtime.openOptionsPage()
  }

  return (
    <Center>
      <Stack w={width} mt={30}>
        <Group justify="space-between">
          <Group gap={6}>
            <img
              width={32}
              height={32}
              src={icon}
              style={{
                borderRadius: 10,
              }}
            />
            <Title order={4} ml={2}>
              {packageJson.displayName}
            </Title>
          </Group>
          <Group>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Icon
                  style={{ cursor: 'pointer' }}
                  fontSize={18}
                  icon={'tabler:dots-vertical'}
                />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  onClick={handleOpenOptionsPage}
                  leftSection={<Icon fontSize={18} icon={'tabler:settings'} />}
                >
                  Settings
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
        {renderBody()}
      </Stack>
    </Center>
  )
}

export default LayoutTool
