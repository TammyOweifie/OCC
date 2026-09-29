// Portable Text ↔ plain paragraph text helpers.
// The admin form uses a plain textarea (paragraphs split by blank lines).
// Sanity stores rich content as Portable Text blocks.

import { randomBytes } from 'node:crypto'

function key() {
  return randomBytes(6).toString('hex')
}

// Split plain textarea input into an array of PT blocks.
export function textToPortableText(input) {
  if (!input || typeof input !== 'string') return []
  return input
    .split(/\n\s*\n/) // blank line separates paragraphs
    .map(p => p.trim())
    .filter(Boolean)
    .map(text => ({
      _type: 'block',
      _key: key(),
      style: 'normal',
      markDefs: [],
      children: [
        { _type: 'span', _key: key(), text, marks: [] },
      ],
    }))
}

// Flatten Portable Text blocks back to plain text with \n\n between paragraphs.
export function portableTextToText(blocks) {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .map(block =>
      Array.isArray(block?.children)
        ? block.children.map(c => c?.text || '').join('')
        : ''
    )
    .filter(Boolean)
    .join('\n\n')
}
