import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut icon" href="/public/static/favicon.ico" />
        </Head>
        <body className="bg-gray-900">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument