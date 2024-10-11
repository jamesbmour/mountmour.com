// SITE object contains metadata for the website, such as title, description, and default language.
export const SITE = {
  title: 'Mountmour', description: 'Your website description.', defaultLanguage: 'en-us'
} as const

export const OPEN_GRAPH = {
  image: {
    src: 'default-og-image.png',
    alt:
      'astro logo on a starry expanse of space,' +
      ' with a purple saturn-like planet floating in the right foreground'
  },
}

export const KNOWN_LANGUAGES = {
  Deutsch: 'de',
  English: 'en'
} as const

export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES)

export const EDIT_URL = `https://github.com/`

export const COMMUNITY_INVITE_URL = `https://astro.build/chat`

export const ALGOLIA = {
  indexName: 'XXXXXXXXXX', appId: 'XXXXXXXXXX', apiKey: 'XXXXXXXXXX'
}

export type Sidebar = Record<
  (typeof KNOWN_LANGUAGE_CODES)[number],
  Record<string, { text: string; link: string }[]>
>

export const SIDEBAR: Sidebar = {
  de: {
    Überschrift: [
      { text: 'Quick Guide', link: 'en/introduction' }
    ],
  },
  en: {
    'Guide Books': [
      { text: 'Home', link: 'en/introduction' },
      { text: 'Welcome Letter', link: 'en/guides/welcome' },
      { text: 'Quick Guide', link: 'en/guides/quick-guide' },
      { text: 'Maps', link: 'en/maps' },
      // { text: 'Town Guide', link: 'en/guides/town-guide' },
      // { text: 'Winter Activities', link: 'en/winter-activities' },
      // { text: 'Summer Activities', link: 'en/summer-activities' },
      { text: 'WiFi', link: 'en/wifi' },
      { text: 'Sonos', link: 'en/sonos' },
      { text: 'Contact', link: 'en/contact' }
    ],
    'Kitchen & Living Room': [
      { text: 'TV Remote', link: 'en/tv-remote' },
      
      { text: 'Air Conditioner', link: 'en/air-conditioner' },
      { text: 'Heating', link: 'en/heating' },
      
      
      { text: 'Dishwasher', link: 'en/dishwasher' },
      { text: 'Stove', link: 'en/stove' }
    ],
    'Living Room': [
      { text: 'Channel Guide', link: 'en/channel-guide' },
      { text: 'Remote Control', link: 'en/remote-control' },
    ]
  }
}
