'use client';

import { createGlobalStyle } from 'styled-components';

const StyledGlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`;

export default function GlobalStyle() {
  return <StyledGlobalStyle />;
}
