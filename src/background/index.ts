import mellowtel from '@/libs/mellowtel'
import browser from 'webextension-polyfill'

mellowtel.initBackground().then().catch(console.error)

browser.action.onClicked.addListener(async () => {
  const url = browser.runtime.getURL('tabs/tool.html')
  await browser.tabs.create({ url })
})
