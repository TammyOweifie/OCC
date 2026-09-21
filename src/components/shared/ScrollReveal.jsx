// Wrapper that animates children into view on scroll
import { Children } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const REVEAL_EASE = [0.16, 1, 0.3, 1]
const DEFAULT_DURATION = 0.7
const DEFAULT_Y = 24
const DEFAULT_STAGGER = 0.1
const VIEWPORT = { once: true, amount: 0.15, margin: '0px 0px -50px 0px' }

function ScrollReveal({
  delay = 0,
  stagger = false,
  amount,
  className,
  children,
  ...rest
}) {
  const prefersReduce = useReducedMotion()

  if (prefersReduce) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    )
  }

  const viewport = amount !== undefined ? { ...VIEWPORT, amount } : VIEWPORT

  if (stagger) {
    const staggerAmount =
      typeof stagger === 'number' ? stagger : DEFAULT_STAGGER

    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: staggerAmount,
              delayChildren: delay,
            },
          },
        }}
        {...rest}
      >
        {Children.map(children, (child, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: DEFAULT_Y },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: DEFAULT_DURATION,
                  ease: REVEAL_EASE,
                },
              },
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: DEFAULT_Y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: DEFAULT_DURATION, ease: REVEAL_EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal
