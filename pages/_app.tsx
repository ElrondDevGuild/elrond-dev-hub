import '../styles/globals.scss';

import { DefaultSeo } from 'next-seo';
import { AppProps } from 'next/app';
import { useEffect } from 'react';

import { AuthContextProvider } from '../hooks/useAuth';
import { ProfileRequirementContextProvider } from '../hooks/useProfileRequirement';
import { ThemeHelper } from '../utils/theme';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const themeHelper = new ThemeHelper();
    const theme = themeHelper.theme;
    document.body.classList.add(theme);
  }, []);
  return (
    <>
      <DefaultSeo
        titleTemplate="xDevHub | %s"
        defaultTitle="xDevHub"
        description="Get started with MultiversX Development. MultiversX is a highly scalable, fast and secure blockchain platform for distributed apps, enterprise use cases and the new internet economy."
        openGraph={{
          type: "website",
          site_name: "xDevHub",
          images: [
            {
              url: `https://xdevhub.com/og-image.png`,
              width: 1200,
              height: 675,
              type: "image/png",
            },
          ],
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />
      <AuthContextProvider env={process.env.NODE_ENV === "production" ? "mainnet" : "devnet"}>
        <ProfileRequirementContextProvider>
          <div className="bg-secondary dark:bg-secondary-dark">
            <Component {...pageProps} />
          </div>
        </ProfileRequirementContextProvider>
      </AuthContextProvider>
    </>
  );
}

export default MyApp;
