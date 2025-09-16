import mellowtel from '@/libs/mellowtel'
import browser from 'webextension-polyfill'

mellowtel.initBackground().then().catch(console.error)

browser.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    const url = browser.runtime.getURL('tabs/tool.html')
    await browser.tabs.create({ url })
  }
})

browser.action.onClicked.addListener(async () => {
  const url = browser.runtime.getURL('tabs/tool.html')
  await browser.tabs.create({ url })
})
