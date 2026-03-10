import React from 'react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="govuk-breadcrumbs" aria-label="Breadcrumb">
      <ol className="govuk-breadcrumbs__list">
        {items.map((item, index) => (
          <li key={index} className="govuk-breadcrumbs__list-item">
            <a className="govuk-breadcrumbs__link" href={item.href}>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
