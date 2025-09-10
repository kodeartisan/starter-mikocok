import theme from '@/libs/theme'
import { MantineProvider } from '@mantine/core'
import React from 'react'
import '@mantine/core/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/dates/styles.css'
import LayoutTool from '@/components/Layout/LayoutTool'
import ModalMellowtel from '@/components/Modal/ModalMellowtel'
import ToastProvider from '@/components/Toast/ToastProvider'
import { Action } from '@/constants'
import SqlFormatter from '@/features/dev/SqlFormatter'
import UrlParser from '@/features/dev/UrlParser'
import CssGradientGenerator from '@/features/generator/CssGradientGenerator'
import CssShadowGenerator from '@/features/generator/CssShadowGenerator'
import FaviconGenerator from '@/features/generator/FaviconGenerator'
import MetaTagGenerator from '@/features/generator/MetaTagGenerator'
import RobotsTxtGenerator from '@/features/generator/RobotsTxtGenerator'
import SitemapXmlGenerator from '@/features/generator/SitemapXmlGenerator'
import JpgCompress from '@/features/image/JpgCompress'
import JpgToPng from '@/features/image/JpgToPng'
import useWindowMessage from '@/hooks/useWindowMessage'
import { useDisclosure } from '@mantine/hooks'

const Tool: React.FC = () => {
  const [showModalMellowtel, modalMellowtel] = useDisclosure(false)
  useWindowMessage(async (event: MessageEvent) => {
    const {
      data: { action, body },
    } = event
    switch (action) {
      case Action.Window.SHOW_MODAL_MELLOWTEL:
        modalMellowtel.toggle()
        break

      default:
        break
    }
  })

  return (
    <MantineProvider theme={theme}>
      <SqlFormatter />
      <ToastProvider />
      <ModalMellowtel
        opened={showModalMellowtel}
        onClose={modalMellowtel.close}
      />
    </MantineProvider>
  )
}

export default Tool
