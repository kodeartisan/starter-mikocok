import env from '@/utils/env'
import Mellowtel from 'mellowtel'

export const getMellowtel = () => {
  const mellowtel = new Mellowtel(process.env.PLASMO_PUBLIC_MELLOWTEL_KEY, {
    disableLogs: env.isProduction(),
  })
  return mellowtel
}

export const initBackground = async () => {
  await getMellowtel().initBackground()
}

export const initContentScript = async () => {
  await getMellowtel().initContentScript()
}

export default {
  getMellowtel,
  initBackground,
  initContentScript,
}
