import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=1200" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
