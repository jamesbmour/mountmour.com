// SITE object contains metadata for the website, such as title, description, and default language.
export const SITE = {
  title: 'Mountmour', description: 'Airbnb Aspen House Guide.', defaultLanguage: 'en-us'
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
  indexName: 'mountmour_articles', appId: '37J3RB86OE', apiKey: 'f079bd3edcd05fff46132f406ec56749'
}

export type Sidebar = Record<
  (typeof KNOWN_LANGUAGE_CODES)[number],
  Record<string, { text: string; link: string }[]>
>

export const SIDEBAR: Sidebar = {
  de: {
    Überschrift: [
      { text: 'Quick Guide', link: 'en/home' }
    ],
  },
  en: {
    'Guide Books': [
      { text: 'Home', link: 'en/home' },
      { text: 'Welcome Letter', link: 'en/guides/welcome' },
      { text: 'Quick Guide', link: 'en/guides/quick-guide' },
      { text: 'Maps', link: 'en/guides/maps' },
      // { text: 'Town Guide', link: 'en/guides/town-guide' },
      // { text: 'Winter Activities', link: 'en/winter-activities' },
      // { text: 'Summer Activities', link: 'en/summer-activities' },
   
      { text: 'Contact', link: 'en/contact' }
    ],
    'Kitchen': [
      { text: 'Dishwasher', link: 'en/kitchen/dishwasher' },
      { text: 'Stove', link: 'en/kitchen/stove' },
      { text: 'Washing Machine', link: 'en/kitchen/washing-machine' }
    ],
    'Living Room': [
      { text: 'WiFi', link: 'en/living-room/wifi' },
      { text: 'Sonos', link: 'en/living-room/sonos' },
      { text: 'TV Remote', link: 'en/living-room/tv-remote' },
      { text: 'Channel Guide', link: 'en/living-room/channel-guide' },
      // { text: 'Remote Control', link: 'en/living-room/remote-control' },
    ],
    'Other': [
      { text: 'Air Conditioner', link: 'en/other/air-conditioner' },
      { text: 'Heating', link: 'en/other/heating' },   
      { text: 'Ski Maps', link: 'en/other/ski-maps' },  
     ]

  }
}
