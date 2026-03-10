import React from 'react';

interface TextAreaProps {
  id: string;
  name: string;
  label: string;
  hint?: string;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
}

export default function TextArea({ id, name, label, hint, rows = 5, value, onChange }: TextAreaProps) {
  return (
    <div className="govuk-form-group">
      <label className="govuk-label govuk-body" htmlFor={id}>
        {label}
      </label>
      {hint && (
        <div id={`${id}-hint`} className="govuk-hint">
          {hint}
        </div>
      )}
      <textarea 
        className="govuk-textarea" 
        id={id} 
        name={name} 
        rows={rows}
        aria-describedby={hint ? `${id}-hint` : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ borderWidth: '2px' }}
      />
    </div>
  );
}
