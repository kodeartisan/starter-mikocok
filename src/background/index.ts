import mellowtel from '@/libs/mellowtel'
import browser from 'webextension-polyfill'

mellowtel.initBackground().then().catch(console.error)

browser.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await mellowtel.getMellowtel().generateAndOpenOptInLink()
  }
})
