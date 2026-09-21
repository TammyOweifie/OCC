// Reusable styled button/link component
import { Link } from 'react-router-dom'

const baseClasses =
  'inline-block px-10 py-4 text-xs uppercase tracking-eyebrow font-medium transition-colors duration-200'

const variantClasses = {
  primary: 'bg-forest-800 text-sand-50 hover:bg-accent',
  secondary:
    'border border-forest-800 text-forest-800 hover:bg-forest-800 hover:text-sand-50',
}

function Button({
  variant = 'primary',
  to,
  href,
  className = '',
  children,
  ...rest
}) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim()

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}

export default Button
