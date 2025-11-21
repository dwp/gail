import type { Metadata } from "next";
import Script from "next/script";
import { SkipLink, Layout } from "./components";
import AllProviders from "./providers/AllProviders";
import "./globals.css";
import "./index.scss";

export const metadata: Metadata = {
  title: "DWP Ask",
  description: "DWP Ask",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="govuk-template__body govuk-frontend-supported">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PTF5XGF5"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Script strategy="afterInteractive" id="g-analytics">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-PTF5XGF5');`}
        </Script>
        <AllProviders>
          <SkipLink />
          <Layout>{children}</Layout>
        </AllProviders>
      </body>
    </html>
  );
}
