import React from 'react';

interface SourceDocumentsProps {
  documents: string[];
  uploadUrl?: string;
}

export default function SourceDocuments({ documents, uploadUrl = '/home/file-upload' }: SourceDocumentsProps) {
  return (
    <>
      <h2 className="govuk-heading-m" style={{ marginTop: '2rem' }}>Your source documents</h2>
      <p className="govuk-body">You have uploaded:</p>
      <ul className="govuk-list govuk-list--bullet">
        {documents.map((doc, index) => (
          <li key={index}>{doc}</li>
        ))}
      </ul>
      <p className="govuk-body">Adding more documents will take you back to the upload screen.</p>
      <a href={uploadUrl} className="govuk-link">Add source documents</a>
    </>
  );
}
