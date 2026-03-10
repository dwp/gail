import React from 'react';
import CheckboxGroup from '../CheckboxGroup/CheckboxGroup';

interface DownloadCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function DownloadCheckbox({ checked, onChange }: DownloadCheckboxProps) {
  const handleChange = (values: string[]) => {
    onChange(values.includes('download'));
  };

  return (
    <CheckboxGroup
      legend="Download this page now (optional)"
      hint="You should save a copy of this page to Sharepoint. You may do this now or when you have finished drafting your content"
      name="download"
      options={[
        { value: 'download', label: 'Download a copy of these to my device.' },
      ]}
      selectedValues={checked ? ['download'] : []}
      onChange={handleChange}
      boldLegend={true}
    />
  );
}
