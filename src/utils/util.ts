import { Action } from '@/constants'
import mellowtel from '@/libs/mellowtel'
import { sendToBackground } from '@plasmohq/messaging'
import _ from 'lodash'

export async function delay(timeoutMs = 1000) {
  await new Promise((resolve) => setTimeout(resolve, timeoutMs))
}

export const postMessage = (action: string, body: any = null) => {
  window.postMessage({ action, body })
}

export const showModalPricing = () => {
  postMessage(Action.Window.SHOW_MODAL_MELLOWTEL)
}

export const onActionMellowtel = async (action: () => void) => {
  const isOptIn = await mellowtel.isOptIn()
  if (!isOptIn) {
    showModalPricing()
    return
  }
  action()
}
