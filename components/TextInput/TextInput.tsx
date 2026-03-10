import React from 'react';

interface TextInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TextInput({ id, name, label, value, onChange }: TextInputProps) {
  return (
    <div className="govuk-form-group">
      <label className="govuk-label govuk-body" htmlFor={id}>
        {label}
      </label>
      <input 
        className="govuk-input" 
        id={id} 
        name={name} 
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ borderWidth: '2px' }}
      />
    </div>
  );
}
