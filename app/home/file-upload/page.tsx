'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Breadcrumbs } from '@/components';
import { useSearchParams } from 'next/navigation';

interface UploadedFile {
  id: string;
  name: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

function FileUploadContent() {
  const searchParams = useSearchParams();
  const nextPage = searchParams.get('next') || 'powerpoint';
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const docs = localStorage.getItem('uploadedDocs');
    if (docs) {
      const existingDocs = JSON.parse(docs);
      setUploadedFiles(existingDocs.map((name: string) => ({
        id: name,
        name: name,
        status: 'success' as const
      })));
    }
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const files = event.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    const newFiles: UploadedFile[] = filesArray.map(file => ({
      id: file.name,
      name: file.name,
      status: 'pending'
    }));

    const allFiles = [...uploadedFiles, ...newFiles];

    if (allFiles.length > 10) {
      setError('You can upload up to 10 files');
      return;
    }

    setUploadedFiles(allFiles);
    setIsUploading(true);

    // Simulate upload for each file
    for (const file of newFiles) {
      const fileIndex = allFiles.findIndex(f => f.id === file.id);
      allFiles[fileIndex].status = 'uploading';
      setUploadedFiles([...allFiles]);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      allFiles[fileIndex].status = 'success';
      setUploadedFiles([...allFiles]);
    }

    setIsUploading(false);
    event.target.value = '';
  };

  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const handleContinue = () => {
    if (uploadedFiles.length === 0) {
      setError('Select a file');
      return;
    }
    const allSuccess = uploadedFiles.every(f => f.status === 'success');
    if (!allSuccess) return;
    
    localStorage.setItem('uploadedDocs', JSON.stringify(uploadedFiles.map(f => f.name)));
    window.location.href = `/home/${nextPage}`;
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Home', href: '/home' },
        { label: 'File upload', href: '/home/file-upload' }
      ]} />
      
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-l">Upload source documents</h1>
          <p className="govuk-body">You can add up to 10 files.</p>
          
          <p className="govuk-body">Make sure each file:</p>
          <ul className="govuk-list govuk-list--bullet">
            <li>is .docx, .pptx or .PDF</li>
            <li>is smaller than 10MB</li>
            <li>contains text</li>
            <li>does not have sensitivity labels, such as 'Official' or 'Sensitive'</li>
            <li>does not contain abusive or offensive language</li>
            <li>does not contain personal identifiable information (PII)</li>
          </ul>
          
          {error && (
            <div className="govuk-error-message">
              <span className="govuk-visually-hidden">Error:</span> {error}
            </div>
          )}
          
          <div className="govuk-form-group">
            <input
              className="govuk-file-upload"
              id="file-upload"
              name="file-upload"
              type="file"
              onChange={handleFileChange}
              multiple
              accept=".docx,.pptx,.pdf"
              disabled={isUploading}
            />
          </div>

          {uploadedFiles.length > 0 && (
            <>
              <div className="govuk-body" style={{ marginBottom: '1rem' }}>
                {uploadedFiles.filter(f => f.status === 'success').length} of {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded
              </div>
              <div style={{ marginBottom: '2rem' }}>
                {uploadedFiles.map((file) => (
                  <div key={file.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      <span className="govuk-body" style={{ marginBottom: 0, flex: 1, minWidth: 0 }}>{file.name}</span>
                      {file.status === 'success' && (
                        <strong className="govuk-tag govuk-tag--green">Success</strong>
                      )}
                      {file.status === 'uploading' && (
                        <strong className="govuk-tag govuk-tag--blue">Uploading</strong>
                      )}
                      {file.status === 'pending' && (
                        <strong className="govuk-tag govuk-tag--grey">Pending</strong>
                      )}
                      {file.status === 'error' && (
                        <strong className="govuk-tag govuk-tag--red">{file.error || 'Error'}</strong>
                      )}
                    </div>
                    {!isUploading && (
                      <a href="#" className="govuk-link" onClick={(e) => { e.preventDefault(); removeFile(file.id); }}>
                        Remove
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <button 
            className="govuk-button" 
            data-module="govuk-button"
            onClick={handleContinue}
            disabled={isUploading}
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );
}

export default function FileUpload() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FileUploadContent />
    </Suspense>
  );
}
