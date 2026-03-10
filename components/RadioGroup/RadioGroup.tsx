import React from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  legend: string;
  hint?: string;
  name: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export default function RadioGroup({ legend, hint, name, options, selectedValue, onChange }: RadioGroupProps) {
  return (
    <div className="govuk-form-group">
      <fieldset className="govuk-fieldset" aria-describedby={hint ? `${name}-hint` : undefined}>
        <legend className="govuk-fieldset__legend">
          <span className="govuk-body">{legend}</span>
        </legend>
        {hint && (
          <div id={`${name}-hint`} className="govuk-hint">
            {hint}
          </div>
        )}
        <div className="govuk-radios" data-module="govuk-radios">
          {options.map((option, index) => (
            <div key={option.value} className="govuk-radios__item">
              <input
                className="govuk-radios__input"
                id={`${name}-${index}`}
                name={name}
                type="radio"
                value={option.value}
                checked={selectedValue === option.value}
                onChange={(e) => onChange(e.target.value)}
              />
              <label className="govuk-label govuk-radios__label govuk-body" htmlFor={`${name}-${index}`}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
