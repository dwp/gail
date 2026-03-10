'use client';

import { useState, useEffect } from 'react';
import { Breadcrumbs, TextInput, CheckboxGroup, TextArea, RadioGroup, SourceDocuments, DownloadCheckbox } from '@/components';

export default function PowerPoint() {
  const [formData, setFormData] = useState({
    topic: '',
    audience: '',
    keyPoints: '',
    additionalInstructions: '',
    aim: ''
  });

  const [topics, setTopics] = useState<string[]>(['']);
  const [formatOptions, setFormatOptions] = useState<string[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState<string>('');
  const [downloadChecked, setDownloadChecked] = useState<boolean>(false);

  useEffect(() => {
    const docs = localStorage.getItem('uploadedDocs');
    if (docs) {
      setUploadedDocs(JSON.parse(docs));
    }
  }, []);

  const addTopic = () => {
    if (topics.length < 10) {
      setTopics([...topics, '']);
    }
  };

  const removeTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const updateTopic = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Home', href: '/home' },
        { label: 'File upload', href: '/home/file-upload' },
        { label: 'PowerPoint slide deck', href: '/home/file-upload/powerpoint' }
      ]} />
      
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-l">PowerPoint slide deck</h1>

          <h2 className="govuk-heading-m govuk-!-margin-top-6">About the presentation</h2>
          <TextInput
            id="title"
            name="title"
            label="Presentation title"
            value={formData.topic}
            onChange={(value) => setFormData({...formData, topic: value})}
          />

          <TextInput
            id="audience"
            name="audience"
            label="Audience"
            value={formData.audience}
            onChange={(value) => setFormData({...formData, audience: value})}
          />

          <TextArea
            id="aim"
            name="aim"
            label="What do you want the audience to know, think or do after this presentation?"
            rows={3}
            value={formData.aim}
            onChange={(value) => setFormData({...formData, aim: value})}
          />

          {topics.map((topic, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              {index === 0 && (
                <label className="govuk-label govuk-body">Add up to 10 topics</label>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  className="govuk-input" 
                  id={`topic-${index}`}
                  name={`topic-${index}`}
                  type="text"
                  value={topic}
                  onChange={(e) => updateTopic(index, e.target.value)}
                  style={{ flex: 1, borderWidth: '2px' }}
                />
                {topics.length > 1 && (
                  <a 
                    href="#" 
                    className="govuk-link" 
                    onClick={(e) => { e.preventDefault(); removeTopic(index); }}
                  >
                    Remove
                  </a>
                )}
              </div>
            </div>
          ))}

          {topics.length < 10 && (
            <button 
              type="button"
              className="govuk-button govuk-button--secondary" 
              data-module="govuk-button"
              onClick={addTopic}
              style={{ marginBottom: '20px' }}
            >
              Add topic
            </button>
          )}

          <RadioGroup
            legend="Tone"
            hint="All content should align with DWP style and standards"
            name="tone"
            options={[
              { value: 'formal', label: 'Formal' },
              { value: 'conversational', label: 'Conversational' },
              { value: 'technical', label: 'Inspiring' },
            ]}
            selectedValue={selectedTone}
            onChange={setSelectedTone}
          />

          <TextArea
            id="additional-instructions"
            name="additional-instructions"
            label="Additional instructions (optional)"
            hint="Provide any additional context or requirements"
            rows={5}
            value={formData.additionalInstructions}
            onChange={(value) => setFormData({...formData, additionalInstructions: value})}
          />

          <CheckboxGroup
            legend="About slides"
            hint="Select all that apply"
            name="format"
            options={[
              { value: 'images', label: 'Title' },
              { value: 'charts', label: 'Suggested visuals' },
              { value: 'examples', label: 'Speaker notes' },
            ]}
            selectedValues={formatOptions}
            onChange={setFormatOptions}
            boldLegend={true}
          />

          <TextInput
            id="max-bullets"
            name="max-bullets"
            label="Maximum bullets per slide"
            value={formData.keyPoints}
            onChange={(value) => setFormData({...formData, keyPoints: value})}
          />
               
          <SourceDocuments documents={uploadedDocs} uploadUrl="/home/file-upload?next=powerpoint" />
          
          <div className="govuk-!-margin-top-6">
            <DownloadCheckbox checked={downloadChecked} onChange={setDownloadChecked} />
          </div>

          <button className="govuk-button" data-module="govuk-button" onClick={() => window.location.href = '/home/draft'}>
            Create draft
          </button>
        </div>
      </div>
    </>
  );
}
