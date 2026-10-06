// Gallery image schema
// --------------------
// Matches the shape currently exported from src/data/gallery.js (on the
// gallery branch):  { id, src, alt }
//
// Field-to-current-data mapping:
//   slug        → id       (via slug.current)
//   image       → src      (via image.asset->url)
//   image.alt   → alt
//   orderRank   → manual ordering; lower numbers show first (falls back
//                 to _createdAt desc when not set)
//   caption     → optional; not consumed by the current public page

export default {
  name: 'galleryImage',
  title: 'Gallery image',
  type: 'document',
  fields: [
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Auto-generated from the alt text on upload.',
      options: {
        source: 'image.alt',
        maxLength: 80,
      },
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        {
          name: 'alt',
          title: 'Alt text',
          description: 'Short description of what the photo shows.',
          type: 'string',
        },
      ],
    },
    {
      name: 'caption',
      title: 'Caption',
      description: 'Optional. Not currently displayed on the public gallery.',
      type: 'string',
    },
    {
      name: 'orderRank',
      title: 'Order',
      description: 'Lower numbers appear first. Leave blank to sort by upload date.',
      type: 'number',
    },
  ],
  orderings: [
    {
      title: 'Manual (orderRank asc)',
      name: 'orderRankAsc',
      by: [{ field: 'orderRank', direction: 'asc' }],
    },
    {
      title: 'Newest first',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'image.alt',
      media: 'image',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Untitled photo',
        media,
      }
    },
  },
}
