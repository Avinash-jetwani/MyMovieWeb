// StyledComponents.js
import styled from 'styled-components';

export const StyledButton = styled.button`
background-color: white;
color: black;
padding: 10px;
margin: 5px;
border: none;
cursor: pointer;

&:hover {
  background-color: grey;
}
`;

const Text = styled.p`
  font-family: 'Roboto', sans-serif;
`;

export default Text;
