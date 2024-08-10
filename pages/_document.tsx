import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="google-site-verification"
            content="hbjX60cKw02DgxIEZagRx5S1h9obDDyMZG2pSbs_7RQ"
          />
          
          <link href="https://github.com/samuelkraft" rel="me" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
