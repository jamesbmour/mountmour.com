export const SITE = {
  title: 'Mountmour',
  description: 'Your website description.',
  defaultLanguage: 'en-us'
} as const

export const OPEN_GRAPH = {
  image: {
    src: 'default-og-image.png',
    alt:
      'astro logo on a starry expanse of space,' +
      ' with a purple saturn-like planet floating in the right foreground'
  },
  twitter: 'astrodotbuild'
}

export const KNOWN_LANGUAGES = {
  Deutsch: 'de',
  English: 'en'
} as const
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES)

export const EDIT_URL = `https://github.com/advanced-astro/astro-docs-template/tree/main`

export const COMMUNITY_INVITE_URL = `https://astro.build/chat`

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: 'XXXXXXXXXX',
  appId: 'XXXXXXXXXX',
  apiKey: 'XXXXXXXXXX'
}

export type Sidebar = Record<
  (typeof KNOWN_LANGUAGE_CODES)[number],
  Record<string, { text: string; link: string }[]>
>
export const SIDEBAR: Sidebar = {
  de: {
    Überschrift: [
    ],
  },
  en: {
    'Guide Books': [
      { text: 'Quick Guide', link: 'en/introduction' },
      { text: 'Town Guide', link: 'en/town-guide' },
      { text: 'Winter Activities', link: 'en/winter-activities' },
      { text: 'Summer Activities', link: 'en/summer-activities' }
    ],
    'Kitchen & Living Room': [
      { text: 'TV Remove', link: 'en/tv-remove' },
      { text: 'Channel Guide', link: 'en/channel-guide' },
      { text: 'Remote Control', link: 'en/remote-control' },
      { text: 'Air Conditioner', link: 'en/air-conditioner' },
      { text: 'WiFi', link: 'en/wifi' },
      { text: 'Sonos', link: 'en/sonos' },
      { text: 'Dishwasher', link: 'en/dishwasher' }
    ],
    'Bedroom & Bathroom': [
      { text: 'Bedroom', link: 'en/bedroom' },
      { text: 'Bathroom', link: 'en/bathroom' }
    ]
  }
}
