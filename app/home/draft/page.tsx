'use client';

import React from 'react';
import { Breadcrumbs } from '@/components';

export default function Draft() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'Home', href: '/home' },
        { label: 'File upload', href: '/home/file-upload' },
        { label: 'PowerPoint slide deck', href: '/home/powerpoint' },
        { label: 'Draft', href: '/home/draft' }
      ]} />
      
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-l">Draft</h1>
        </div>
      </div>
    </>
  );
}
