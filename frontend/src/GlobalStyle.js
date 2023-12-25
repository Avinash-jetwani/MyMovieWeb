// src/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background-color: black;
    color: white;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  // Example media query for tablets
  @media (max-width: 768px) {
    body {
      background-color: darkgray;
    }
  }

  // Example media query for mobile devices
  @media (max-width: 480px) {
    body {
      background-color: lightgray;
    }
  }
`;

export default GlobalStyle;
