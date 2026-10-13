// News post schema
// ----------------
// Matches the shape currently exported from src/data/news.js:
//   { id, title, date, excerpt, body, coverImage, coverAlt }
//
// Field-to-current-data mapping:
//   title       → title
//   slug        → id (via slug.current)
//   date        → date (display date shown on the card)
//   publishedAt → gates public visibility; null = draft, future = scheduled
//   thumbnail   → coverImage (via .asset->url) + coverAlt (via .alt)
//   excerpt     → excerpt
//   body        → body (portable text; flattened to string[] in the fetch fn)

export default {
  name: 'newsPost',
  title: 'News post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'date',
      title: 'Date (shown on card)',
      description: 'The date displayed on the news card. Separate from the publish gate below.',
      type: 'datetime',
    },
    {
      name: 'publishedAt',
      title: 'Publish at',
      description: 'When this post goes live to the public. Leave empty to save as a draft. Set to a future date/time to schedule.',
      type: 'datetime',
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        },
      ],
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      description: 'Short summary shown on the card (2–3 sentences).',
      type: 'text',
      rows: 3,
    },
    {
      name: 'body',
      title: 'Body',
      description: 'Full content shown in the modal / detail view.',
      type: 'array',
      of: [{ type: 'block' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      publishedAt: 'publishedAt',
      media: 'thumbnail',
    },
    prepare({ title, date, publishedAt, media }) {
      let status
      if (!publishedAt) status = 'DRAFT'
      else if (new Date(publishedAt) > new Date()) status = `SCHEDULED • ${new Date(publishedAt).toLocaleString()}`
      else status = date ? new Date(date).toLocaleDateString() : 'Published'
      return { title, subtitle: status, media }
    },
  },
}
