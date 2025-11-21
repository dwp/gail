import Script from "next/script";

export default function Analytics() {
  return (
    <Script strategy="beforeInteractive" id="g-analytics">
      {`
        dataLayer = [{
            'gtm.allowlist': ['gaawc', 'gaawe', 'ua', 'cl', 'lcl', 'fsl', 'tl', 'jel', 'hl', 'v', 'c', 'ctv', 'e', 'dbg', 'd',
            'f', 'j', 'smm', 'r' ,'u', 'gas', 'remm', 'vis', 'evl' , 'sdl', 'opt' ]
        }];
        `}
    </Script>
  );
}
