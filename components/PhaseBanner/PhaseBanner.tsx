import React from 'react';

export default function PhaseBanner() {
  return (
    <div className="govuk-phase-banner">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag">Prototype</strong>
        <span className="govuk-phase-banner__text">
          This is a prototype version of the GAIL application.
        </span>
      </p>
    </div>
  );
}
