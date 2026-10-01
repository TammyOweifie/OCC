// Founder's Story content
// -----------------------
// Structured copy for src/pages/FoundersStory.jsx. British spellings
// (programmes, organisation) are intentional — do not "correct" them.
//
// Shape:
//   meta      — page title, name/role, portrait { src, alt }
//   opening   — lead paragraph shown next to the portrait
//   sections  — [{ heading, paragraphs, list? }]
//               When `list` is present, its entries render as a clean
//               list (term + description), not as cards.
//   closing   — final pull-quote sentence
//
// Portrait: `src` is null until a real file is added under
// public/assets/images/founder/. Swap it to '/assets/images/founder/<file>'
// and set `alt` in one edit.

const founderStory = {
  meta: {
    pageTitle: "The Founder's Story",
    name: 'Mrs. Owanari Duke',
    role: 'Founder',
    portrait: {
      src: '/assets/images/about/founders-story.jpg',
      alt: 'Mrs. Owanari Duke with colleagues at an Obudu Conservation Centre event',
    },
  },

  opening:
    'In January 2002, when Owanari Duke founded the Obudu Conservation Educational Centre, conservation was not part of Nigeria’s national conversation. Few people talked about biodiversity loss. The country’s disappearing forests drew little public concern, and there was no shared sense that wildlife and wild lands deserved protection. Mrs. Duke was not answering a public demand. She set out to create one.',

  sections: [
    {
      heading: 'Education first',
      paragraphs: [
        'The name she chose reflected her conviction. Before anyone could argue for policy change or run field programmes, people needed to understand what was at stake. You cannot ask a community to protect a landscape it has not yet learned to value, so education came first.',
        'The Centre’s mission was to protect, restore and teach people about the wild lands of the Obudu region. Its focus included the surrounding Cross River National Park, which continues across the border into Cameroon’s Takamanda National Park. Under her leadership, the Centre gave children and communities hands-on experience of the region’s rare biodiversity and helped build a culture of conservation where none had existed.',
      ],
    },
    {
      heading: 'A decade of programmes',
      paragraphs: [
        'Over the following decade, Mrs. Duke built programmes that turned that conviction into practice:',
      ],
      list: [
        {
          term: 'School excursions',
          body: 'She brought students from Lagos, Abuja, Calabar and Port Harcourt, and from as far as Houston and New York, to experience the Obudu landscape first-hand. For many of them it was their first real encounter with the natural world they were being asked to protect.',
        },
        {
          term: 'Research',
          body: 'She worked with the A.G. Leventis Foundation to advance ornithological research in the region. She also brought in researchers from Hunter College of the City University of New York to deepen understanding of the area’s ecology and wildlife.',
        },
        {
          term: 'Partnerships',
          body: 'As a patron and partner of CERCOPAN, she supported the rescue and rehabilitation of primates native to Cross River State.',
        },
      ],
    },
    {
      heading: 'Carrying the work forward',
      paragraphs: [
        'In 2013, her daughter, Nela Ekpenyong, became Chief Executive Officer. Her mandate was to build on this foundation and extend the organisation’s reach and impact. The Centre, now known as the Obudu Conservation Centre, still carries its founding purpose: to preserve, protect and raise awareness of the wildlife and wild lands of the Obudu region and beyond.',
      ],
    },
    {
      heading: 'Her work today',
      paragraphs: [
        'Mrs. Duke remains a leading voice for conservation in Nigeria. She serves on the board of trustees for the Nigerian Conservation Foundation and chairs its finance committee. There she advocates for policies that strengthen climate resilience and protect Nigeria’s most vulnerable communities.',
      ],
    },
  ],

  closing:
    'What began as one woman’s conviction, at a time when few in Nigeria shared it, laid the groundwork for everything the Centre does today.',
}

export function getFounderStory() {
  return founderStory
}
