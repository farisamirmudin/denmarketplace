import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react"
import Head from 'next/head'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div className="banner min-h-screen text-gray-100 py-4 lg:px-0 px-8">
      <Head>
        <title>DEN Market Place</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThirdwebProvider desiredChainId={ChainId.Goerli}>
        <div className="max-w-4xl mx-auto">
          <Nav />
          <Component {...pageProps} />
        </div>
      </ThirdwebProvider>
    </div>
  )

}

export default MyApp
