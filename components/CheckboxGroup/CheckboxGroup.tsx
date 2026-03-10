import React from 'react';

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  legend: string;
  hint?: string;
  name: string;
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  boldLegend?: boolean;
}

export default function CheckboxGroup({ legend, hint, name, options, selectedValues, onChange, boldLegend = false }: CheckboxGroupProps) {
  const handleChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter(v => v !== value));
    }
  };

  return (
    <div className="govuk-form-group">
      <fieldset className="govuk-fieldset" aria-describedby={hint ? `${name}-hint` : undefined}>
        <legend className="govuk-fieldset__legend">
          <span className="govuk-body" style={boldLegend ? { fontWeight: 'bold' } : undefined}>{legend}</span>
        </legend>
        {hint && (
          <div id={`${name}-hint`} className="govuk-hint">
            {hint}
          </div>
        )}
        <div className="govuk-checkboxes" data-module="govuk-checkboxes">
          {options.map((option, index) => (
            <div key={option.value} className="govuk-checkboxes__item">
              <input 
                className="govuk-checkboxes__input" 
                id={`${name}-${index}`}
                name={name}
                type="checkbox"
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={(e) => handleChange(option.value, e.target.checked)}
              />
              <label className="govuk-label govuk-checkboxes__label govuk-body" htmlFor={`${name}-${index}`}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
