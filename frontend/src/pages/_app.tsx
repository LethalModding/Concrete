/* eslint-disable @next/next/no-img-element */
import darkThemeOptions from '@/styles/darkThemeOptions'
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { type AppProps } from 'next/app'
import Head from 'next/head'

export default function App(props: AppProps) {
  const { Component, pageProps } = props

  return (
    <AppCacheProvider {...props}>
      <Head>
        <meta
          name="charset"
          content="utf-8"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>Concrete - LethalModding.com</title>
      </Head>
      <ThemeProvider theme={darkThemeOptions}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            flexDirection: 'column',
            justifyContent: 'stretch',
            height: '100vh',
            userSelect: 'none',

            '*::-webkit-scrollbar': {
              backgroundColor: 'primary.dark',
              width: '0.5em',
            },
            '*::-webkit-scrollbar-thumb': {
              backgroundColor: 'primary.main',

              '&:hover': {
                backgroundColor: 'primary.light',
              },
            },
          }}
        >
          {/* <GlobalAppBar /> */}

          <Component {...pageProps} />
        </Box>
      </ThemeProvider>
    </AppCacheProvider>
  )
}
