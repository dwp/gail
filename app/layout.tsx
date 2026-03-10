import { SkipLink, TopNavBar, PhaseBanner, ContentFooter, GlobalStyle } from '@/components';
import 'govuk-frontend/dist/govuk/all.scss';
import './custom.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" type="image/x-icon" href="/static/favicon.ico" />
      </head>
      <body>
        <SkipLink />
        <GlobalStyle />
        <div>
          <TopNavBar />
          <div className="govuk-width-container">
            <PhaseBanner />
            <main className="govuk-main-wrapper" id="main-content">
              {children}
            </main>
          </div>
        </div>
        <ContentFooter />
      </body>
    </html>
  );
}
