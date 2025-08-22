import mellowtel from '@/libs/mellowtel'
import type { PlasmoCSConfig } from 'plasmo'

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>'],
  all_frames: true,
  run_at: 'document_start',
}

mellowtel.initContentScript().then().catch(console.error)
