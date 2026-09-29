// News data
// ----------
// This array follows the shape expected by src/pages/News.jsx.
// It will be replaced by a Sanity.io fetch — swap the static array below with
// a `client.fetch(query)` call that returns objects of the same shape.
//
// Per-post schema:
//   id          — unique identifier (Sanity: `slug.current`)
//   title       — post title
//   date        — ISO date string (YYYY-MM-DD); formatted at render time
//   excerpt     — short summary shown on the card (line-clamped to 3 lines)
//   body        — array of paragraph strings shown in the detail modal
//                 (Sanity: flatten Portable Text blocks to plain paragraphs, or
//                 render blockContent directly with @portabletext/react)
//   coverImage  — URL/path to the cover image (rendered at 3:2 aspect ratio)
//   coverAlt    — alt text for the cover image
//
// Sanity example replacement:
//   import { client } from '../lib/sanity.js'
//   export async function getNews() {
//     return client.fetch(`*[_type == "newsPost"] | order(date desc) {
//       "id": slug.current, title, date, excerpt, body,
//       "coverImage": coverImage.asset->url,
//       "coverAlt": coverImage.alt
//     }`)
//   }
//
// Set the array to [] to render the empty state.

export const news = [
  {
    id: 'field-update-canopy-corridors-march-2025',
    title: 'Field Update: Monitoring Primate Canopy Corridors',
    date: '2025-03-01',
    excerpt:
      'Initial findings from our recent seasonal acoustic and visual surveys across high-altitude forest tracts, documenting troop movement patterns and territory boundary markers.',
    body: [
      'Initial findings from our recent seasonal acoustic and visual surveys across high-altitude forest tracts, documenting troop movement patterns and territory boundary markers.',
      'Over four months of monitoring, our field team recorded 32 distinct vocalisation clusters attributable to primate troops moving between the northern Aeroplane Field ridgeline and the mid-elevation forests near the natural spring grotto. These corridors are critical for genetic exchange between otherwise-fragmented sub-populations.',
      "The team is now working with local guides to install additional acoustic recorders at the corridor pinch points identified this season, and to establish a long-term monitoring baseline that community patrols can maintain in the years ahead.",
    ],
    coverImage: '/assets/images/news/canopy_corridor.jpg',
    coverAlt: 'Field Update: Monitoring Primate Canopy Corridors',
  },
  {
    id: 'community-story-seedling-guardians-february-2025',
    title: 'Community Story: Seedling Guardians of Okpazange',
    date: '2025-02-01',
    excerpt:
      'How local elders and youth groups are propagating native montane nursery saplings to regenerate vulnerable catchment slopes bordering the Cattle Ranch territory.',
    body: [
      'How local elders and youth groups are propagating native montane nursery saplings to regenerate vulnerable catchment slopes bordering the Cattle Ranch territory.',
      "In the community of Okpazange, a grandmother-led collective has taken responsibility for what they call the 'seedling watch' — a rotating group of youth volunteers who tend nursery beds of indigenous species during the wet season and transplant them out to the reserve edges before the dry.",
      'This year the collective raised over 3,200 saplings across four village nurseries — a 40% increase over 2024. OCC provided training, tools, and species selection guidance, but the labour, care, and generational knowledge are entirely their own.',
    ],
    coverImage: '/assets/images/news/seedling.jpg',
    coverAlt: 'Community Story: Seedling Guardians of Okpazange',
  },
  {
    id: 'field-update-camera-trap-grotto-january-2025',
    title: 'Field Update: Camera Trap Placements Along the Grotto',
    date: '2025-01-01',
    excerpt:
      'Deploying weather-sealed motion cameras deep into misty river ravines to capture nocturnal mammalian biodiversity and monitor endangered endemic fauna.',
    body: [
      'Deploying weather-sealed motion cameras deep into misty river ravines to capture nocturnal mammalian biodiversity and monitor endangered endemic fauna.',
      'Twelve camera traps were installed along the grotto watershed in early January. Sites were selected in collaboration with community forest monitors who identified regularly-used game trails and water access points where nocturnal species are most likely to pass.',
      'Early captures have already documented a healthy population of civet, tree pangolin, and — most encouragingly — repeat visits from a small Preuss\'s monkey troop that had not been observed in this section of the plateau since 2019.',
    ],
    coverImage: '/assets/images/news/camera-trap-grotto.jpg',
    coverAlt: 'Field Update: Camera Trap Placements Along the Grotto',
  },
]
