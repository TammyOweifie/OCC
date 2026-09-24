// Publication schema
// ------------------
// Matches the shape currently exported from src/data/publications.js:
//   { id, title, date, excerpt, body, coverImage, coverAlt }
//
// Field-to-current-data mapping:
//   title      → title
//   slug       → id (via slug.current)
//   date       → date
//   thumbnail  → coverImage (via .asset->url) + coverAlt (via .alt)
//   excerpt    → excerpt
//   body       → body (portable text; flattened to string[] in the fetch fn)

export default {
  name: 'publication',
  title: 'Publication',
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
      title: 'Date published',
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
      media: 'thumbnail',
    },
    prepare({ title, date, media }) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString() : 'No date',
        media,
      }
    },
  },
}
