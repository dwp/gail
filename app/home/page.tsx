'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const creatingOptions = [
    { label: 'E-learning', href: '/home/file-upload?next=e-learning' },
    { label: 'PowerPoint slide deck', href: '/home/file-upload?next=powerpoint' },
    { label: 'Video scripts', href: '/home/file-upload?next=video-scripts' },
    { label: 'Updating a document following a change', href: '/home/file-upload?next=update-document' },
  ];

  const reviewingOptions = [
    { label: 'Explain a new policy or regulation', href: '/home/file-upload?next=policy' },
    { label: 'Summarise survey findings', href: '/home/file-upload?next=summary' },
  ];

  const translatingOptions = [
    { label: 'Activities for an engaging workshop', href: '/home/file-upload?next=workshop' },
    { label: 'Questions for a user or customer survey', href: '/home/file-upload?next=questions' },
  ];

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">Choose an option to start</h1>
        
        <div style={{ border: '1px solid #b1b4b6', padding: '0', marginBottom: '30px' }}>
          <p className="govuk-heading-m" style={{ marginTop: 0, marginBottom: 0, backgroundColor: '#f3f2f1', padding: '15px' }}>
            Creating: formatting content for a specific task or product
          </p>
          
          <div style={{ padding: '20px' }}>
            {creatingOptions.map((option, index) => (
            <React.Fragment key={index}>
              <a 
                href={option.href} 
                className="govuk-link"
                style={{ fontSize: '19px', display: 'block', marginBottom: '15px' }}
              >
                {option.label}
              </a>
              {index < creatingOptions.length - 1 && (
                <hr className="govuk-section-break govuk-section-break--visible" style={{ marginBottom: '15px' }} />
              )}
            </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ border: '1px solid #b1b4b6', padding: '0', marginBottom: '30px' }}>
          <p className="govuk-heading-m" style={{ marginTop: 0, marginBottom: 0, backgroundColor: '#f3f2f1', padding: '15px' }}>
           Clarifying: indentifying important details in complex information
          </p>
          
          <div style={{ padding: '20px' }}>
            {reviewingOptions.map((option, index) => (
            <React.Fragment key={index}>
              <a 
                href={option.href} 
                className="govuk-link"
                style={{ fontSize: '19px', display: 'block', marginBottom: '15px' }}
              >
                {option.label}
              </a>
              {index < reviewingOptions.length - 1 && (
                <hr className="govuk-section-break govuk-section-break--visible" style={{ marginBottom: '15px' }} />
              )}
            </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ border: '1px solid #b1b4b6', padding: '0' }}>
          <p className="govuk-heading-m" style={{ marginTop: 0, marginBottom: 0, backgroundColor: '#f3f2f1', padding: '15px' }}>
            Ideating: trying some new ideas
          </p>
          
          <div style={{ padding: '20px' }}>
            {translatingOptions.map((option, index) => (
            <React.Fragment key={index}>
              <a 
                href={option.href} 
                className="govuk-link"
                style={{ fontSize: '19px', display: 'block', marginBottom: '15px' }}
              >
                {option.label}
              </a>
              {index < translatingOptions.length - 1 && (
                <hr className="govuk-section-break govuk-section-break--visible" style={{ marginBottom: '15px' }} />
              )}
            </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
