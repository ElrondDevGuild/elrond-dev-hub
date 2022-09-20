import '../styles/globals.scss';

import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import {AuthContextProvider} from "../hooks/useAuth";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        titleTemplate="Elrond Dev Hub | %s"
        defaultTitle="Elrond Dev Hub"
        description="Get started with Elrond Development. Elrond is a highly scalable, fast and secure blockchain platform for distributed apps, enterprise use cases and the new internet economy."
        openGraph={{
          type: "website",
          site_name: "Elrond Dev Hub",
          images: [
            {
              url: `https://egldhub.dev/facebook.png`,
                width: 1200,
                height: 630,
                type: "image/png",
            },
          ],
        }}
        twitter={{
            cardType: "summary_large_image",
        }}
      />
        <AuthContextProvider env={process.env.NODE_ENV === "production" ? "mainnet" : "devnet"}>
            <Component {...pageProps} />
        </AuthContextProvider>
    </>
  );
}

export default MyApp;
