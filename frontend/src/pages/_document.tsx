import {
  DocumentHeadTags,
  documentGetInitialProps,
  type DocumentHeadTagsProps,
} from '@mui/material-nextjs/v14-pagesRouter'
import {
  Head,
  Html,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentProps,
} from 'next/document'

import darkThemeOptions from '@/styles/darkThemeOptions'

export default function Document(props: DocumentProps & DocumentHeadTagsProps) {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="theme-color"
          content={darkThemeOptions.palette.primary.main}
        />
        <link
          rel="shortcut icon"
          href="/favicon.ico"
        />
        <meta
          name="emotion-insertion-point"
          content=""
        />
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

Document.getInitialProps = async (ctx: DocumentContext) => {
  const finalProps = await documentGetInitialProps(ctx)
  return finalProps
}
