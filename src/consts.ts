// SITE object contains metadata for the website, such as title, description, and default language.
export const SITE = {
  title: 'Mountmour', // Website title
  description: 'Your website description.', // Brief description of the website
  defaultLanguage: 'en-us' // Default language of the website
} as const

// OPEN_GRAPH object contains metadata for social media sharing, like the image and alt text for Open Graph protocol.
export const OPEN_GRAPH = {
  image: {
    src: 'default-og-image.png', // Path to the default Open Graph image
    alt:
      'astro logo on a starry expanse of space,' +
      ' with a purple saturn-like planet floating in the right foreground' // Alt text for the Open Graph image
  },
}

// KNOWN_LANGUAGES object defines the languages supported by the website and their respective codes.
export const KNOWN_LANGUAGES = {
  Deutsch: 'de', // German language with 'de' code
  English: 'en' // English language with 'en' code
} as const

// Extracting the language codes from the KNOWN_LANGUAGES object to create an array of language codes.
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES)

// URL to the repository where users can edit or contribute to the website content.
export const EDIT_URL = `https://github.com/`

// URL for the community invite, typically a chat or forum for users.
export const COMMUNITY_INVITE_URL = `https://astro.build/chat`

// Algolia search configuration object, used to enable site search functionality.
// Fill in with actual Algolia details in production.
export const ALGOLIA = {
  indexName: 'XXXXXXXXXX', // Algolia index name
  appId: 'XXXXXXXXXX', // Algolia application ID
  apiKey: 'XXXXXXXXXX' // Algolia API key
}

// Sidebar type definition to structure the content links for different languages.
// The structure is Record<languageCode, Record<section, { text: string; link: string }[]>>
export type Sidebar = Record<
  (typeof KNOWN_LANGUAGE_CODES)[number],
  Record<string, { text: string; link: string }[]>
>

// SIDEBAR object defines the sidebar content for each language.
// Each language contains sections with links to various guides and resources.
export const SIDEBAR: Sidebar = {
  de: {
    Überschrift: [
      { text: 'Quick Guide', link: 'en/introduction' } 
    ],
  },
  en: {
    'Guide Books': [
      { text: 'Quick Guide', link: 'en/introduction' },
      { text: 'Maps', link: 'en/maps' }, 
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