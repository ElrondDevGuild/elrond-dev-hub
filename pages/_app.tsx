import "../styles/globals.scss";

import { DefaultSeo } from "next-seo";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { ThemeHelper } from "../utils/theme";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const themeHelper = new ThemeHelper();
    const theme = themeHelper.theme;
    document.body.classList.add(theme);
  }, []);

  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && setLoading(true);
    const handleComplete = (url: string) =>
      url === router.asPath && setLoading(false);
    const handleError = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleError);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleError);
    };
  });

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            bottom: "3rem",
            left: "50%",
            transform: "translateY(-50%)",
            padding: "10px 15px",
            background: "rgb(39, 174, 125,0.6)",
            color: "white",
            borderRadius: "8px",
            zIndex: 9999,
            textAlign: "center",
            fontSize: "14px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }}
        >
          ✨ Loading Cool Stuff...
        </div>
      )}
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
      <div className="bg-secondary dark:bg-secondary-dark">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
