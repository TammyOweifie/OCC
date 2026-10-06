// Report schema
// -------------
// Matches the shape currently exported from src/data/reports.js:
//   { id, body, image, imageAlt, downloadUrl? }
//
// Field-to-current-data mapping:
//   title        → (not consumed by the current page; kept for editor context and future use)
//   date         → (not consumed by the current page; kept for editor context and future use)
//   image        → image (via .asset->url) + imageAlt (via .alt)
//   description  → body
//   file         → downloadUrl (via .asset->url)  ·  optional

export default {
  name: 'report',
  title: 'Report',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'date',
      title: 'Date',
      type: 'datetime',
    },
    {
      name: 'image',
      title: 'Cover image',
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
      name: 'description',
      title: 'Description',
      description: 'Body text shown on the Reports page.',
      type: 'text',
      rows: 6,
    },
    {
      name: 'file',
      title: 'Downloadable file',
      description: 'Optional. Attach a PDF or similar if this report has one.',
      type: 'file',
    },
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'image',
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
