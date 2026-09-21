// Reusable section title + subtitle heading
function SectionHeading({
  eyebrow,
  children,
  align = 'left',
  className = '',
}) {
  const isCenter = align === 'center'
  const wrapperAlign = isCenter ? 'text-center' : 'text-left'
  const eyebrowTracking = isCenter ? 'tracking-eyebrow-wide' : 'tracking-eyebrow'
  const eyebrowMargin = isCenter ? 'mb-4' : 'mb-3'
  const headingTracking = isCenter ? '' : 'tracking-tight'

  return (
    <div className={`${wrapperAlign} ${className}`.trim()}>
      {eyebrow && (
        <span
          className={`block text-xs uppercase ${eyebrowTracking} text-forest-700 font-medium ${eyebrowMargin}`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-sand-900 mb-6 ${headingTracking}`.trim()}
      >
        {children}
      </h2>
    </div>
  )
}

export default SectionHeading
