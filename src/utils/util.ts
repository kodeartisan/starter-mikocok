import { sendToBackground } from '@plasmohq/messaging'
import _ from 'lodash'

export async function delay(timeoutMs = 1000) {
  await new Promise((resolve) => setTimeout(resolve, timeoutMs))
}
