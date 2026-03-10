import React from 'react';

export default function TopNavBar() {
  return (
    <header className="govuk-header" role="banner" data-module="govuk-header">
        <div className="govuk-header__logo">
          <span className="govuk-header__logotype">
            <span className="govuk-header__logotype-text" style={{ fontWeight: 'bold' }}>Generative AI for content</span>
          </span>
        </div>
    </header>
  );
}
