// Reusable content card (used for team members, news posts, etc.)
import { Link } from 'react-router-dom'

function Card({
  image,
  imageAlt = '',
  imageAspect = 'aspect-[3/2]',
  imageClassName,
  imageWrapClassName = '',
  href,
  to,
  className = '',
  children,
  ...rest
}) {
  const wrapperClass = `flex flex-col group ${className}`.trim()

  const imageWrapClass =
    `w-full ${imageAspect} bg-sand-200 border border-sand-300/60 overflow-hidden group-hover:border-accent/40 transition-colors ${imageWrapClassName}`.trim()

  const imgClass =
    imageClassName ?? 'w-full h-full object-cover object-center'

  const content = (
    <>
      {image && (
        <div className={imageWrapClass}>
          <img src={image} alt={imageAlt} className={imgClass} />
        </div>
      )}
      {children && (
        <div className="pt-5 flex flex-col flex-grow">{children}</div>
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={wrapperClass} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={wrapperClass} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <article className={wrapperClass} {...rest}>
      {content}
    </article>
  )
}

export default Card
