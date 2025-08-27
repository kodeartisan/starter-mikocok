// src/components/Layout/LayoutPage.tsx

import {
  Box,
  Card,
  Center,
  Group,
  Paper,
  Stack,
  Title,
  type MantineSpacing,
  type StyleProp,
} from '@mantine/core'
import icon from 'data-base64:../../../assets/icon.png'
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

  return (
    <Center>
      <Stack w={width} mt={60}>
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
        </Group>
        {renderBody()}
      </Stack>
    </Center>
  )
}

export default LayoutTool
