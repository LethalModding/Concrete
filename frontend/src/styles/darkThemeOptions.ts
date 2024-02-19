import { responsiveFontSizes } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { VT323, Open_Sans } from 'next/font/google'

export const vt323 = VT323({
  display: 'swap',
  subsets: ['latin'],
  weight: ['400'],
})

export const openSans = Open_Sans({
  display: 'swap',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
})

// export const roboto = Roboto({
//   display: 'swap',
//   subsets: ['latin'],
//   weight: ['300', '400', '500', '700'],
// })

const primaryColor = '#e8982f'

const textPrimary = 'rgba(255, 255, 255, 0.90)'
const textSecondary = 'rgba(200, 200, 200, 0.90)'

const theme = createTheme({
  palette: {
    mode: 'dark',

    primary: {
      main: primaryColor,
    },

    secondary: {
      main: '#fc0000',
    },

    info: {
      main: '#2B8BDA',
    },

    success: {
      main: '#0CDF64',
    },

    warning: {
      main: '#F3B416',
    },

    error: {
      main: '#C70A0A',
    },

    background: {
      default: 'rgba(25, 25, 30, 0.80)',
      paper: 'rgba(50, 50, 60, 0.80)',
    },

    text: {
      primary: textPrimary,
      secondary: textSecondary,
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 700,
      md: 900,
      lg: 1200,
      xl: 1800,
    },
  },

  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: textSecondary,
          textDecorationStyle: 'dotted',

          '&:hover': {},
        },
      },
    },
  },

  typography: {
    fontFamily: [openSans.style.fontFamily].join(', '),
    htmlFontSize: 18,
  },
})

export default responsiveFontSizes(theme)
