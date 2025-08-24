import theme from '@/libs/theme'
import { MantineProvider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React from 'react'
import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/dates/styles.css'
import ModalMellowtel from '@/components/Modal/ModalMellowtel'

const Tool: React.FC = () => {
  const [showModalMellowtel, modalMellowtel] = useDisclosure(true)
  return (
    <MantineProvider theme={theme}>
      <ModalMellowtel
        opened={showModalMellowtel}
        onClose={modalMellowtel.close}
      />
    </MantineProvider>
  )
}

export default Tool
