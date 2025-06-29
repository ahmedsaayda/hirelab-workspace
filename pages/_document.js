import Document, { Html, Head, Main, NextScript } from 'next/document'




class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Basic meta tags */}
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="theme-color" content="#000000" />

          {/* Favicon and app icons */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/logo192.png" />
          <link rel="manifest" href="/manifest.json" />

          {/* Preconnect to external domains for performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

          {/* Google Fonts - commonly used in business applications */}
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
            rel="stylesheet"
          />

          {/* Additional fonts for icons */}
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
            rel="stylesheet"
          />

          {/* SEO and Open Graph meta tags */}
          <meta name="robots" content="index,follow" />
          <meta name="author" content="HireLab" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="HireLab" />
          <meta name="twitter:card" content="summary_large_image" />

          {/* Performance and resource hints */}
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//fonts.gstatic.com" />

          {/* Add any global scripts here if needed */}
          {/* Example: Google Analytics, Hotjar, etc. */}
        </Head>
        <body>
         

        <Main />



          <NextScript />

          {/* Add any additional scripts that should load after the app */}
        </body>
      </Html>
    )
  }
}

export default MyDocument 