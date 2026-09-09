import MuiLink, { type LinkProps as MuiLinkProps } from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import NextLink, { type LinkProps as NextLinkProps } from 'next/link'
import { useRouter } from 'next/router'

// Add support for the sx prop for consistency with the other branches.
const Anchor = styled('a')({})

interface NextLinkComposedProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Omit<
      NextLinkProps,
      'href' | 'as' | 'passHref' | 'onMouseEnter' | 'onClick' | 'onTouchStart'
    > {
  to: NextLinkProps['href']
  linkAs?: NextLinkProps['as']
  ref?: React.Ref<HTMLAnchorElement>
}

export function NextLinkComposed(props: NextLinkComposedProps) {
  const {
    to,
    linkAs,
    replace,
    scroll,
    shallow,
    prefetch,
    legacyBehavior = true,
    locale,
    ref,
    ...other
  } = props

  return (
    <NextLink
      href={to}
      prefetch={prefetch}
      as={linkAs}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={true}
      locale={locale}
      legacyBehavior={legacyBehavior}
    >
      <Anchor ref={ref} {...other} />
    </NextLink>
  )
}

export type LinkProps = {
  activeClassName?: string
  as?: NextLinkProps['as']
  href: NextLinkProps['href']
  linkAs?: NextLinkProps['as'] // Useful when the as prop is shallow by styled().
  noLinkStyle?: boolean
} & Omit<NextLinkComposedProps, 'to' | 'linkAs' | 'href'> &
  Omit<MuiLinkProps, 'href'>

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/pages/api-reference/components/link
export function Link(props: LinkProps) {
  const {
    activeClassName = 'active',
    as,
    className: classNameProps,
    href,
    legacyBehavior,
    linkAs: linkAsProp,
    locale,
    noLinkStyle,
    prefetch,
    ref,
    replace,
    role, // Link don't have roles.
    scroll,
    shallow,
    ...other
  } = props

  const router = useRouter()
  const pathname = typeof href === 'string' ? href : href.pathname
  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName,
  })

  const isExternal =
    typeof href === 'string' &&
    (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0)

  if (isExternal) {
    if (noLinkStyle) {
      return <Anchor className={className} href={href} ref={ref} {...other} />
    }

    return <MuiLink className={className} href={href} ref={ref} {...other} />
  }

  const linkAs = linkAsProp || as
  const nextjsProps = {
    to: href,
    linkAs,
    replace,
    scroll,
    shallow,
    prefetch,
    legacyBehavior,
    locale,
  }

  if (noLinkStyle) {
    return (
      <NextLinkComposed
        className={className}
        ref={ref}
        {...nextjsProps}
        {...other}
      />
    )
  }

  return (
    <MuiLink
      component={NextLinkComposed}
      className={className}
      ref={ref}
      {...nextjsProps}
      {...other}
    />
  )
}
