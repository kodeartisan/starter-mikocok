import theme from '@/libs/theme'
import { MantineProvider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React from 'react'
import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/dates/styles.css'
import LayoutTool from '@/components/Layout/LayoutTool'

const Tool: React.FC = () => {
  return (
    <MantineProvider theme={theme}>
      <LayoutTool>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat,
        architecto. Magni, commodi repellendus eveniet rerum modi eaque,
        maiores, id alias ut error provident temporibus corrupti atque saepe
        perspiciatis nobis perferendis.
      </LayoutTool>
    </MantineProvider>
  )
}

export default Tool
