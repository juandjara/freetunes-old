import styled from 'styled-components';

const Button = styled.button`
  background: ${props => props.playing ? '#f7f7f7' : 'white'};
  color: var(--color-accent);
  border-radius: 4px;
  padding: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
  margin: 0 6px;
  ${props => props.centered ? `
    margin: 20px auto;
    padding: 8px 12px;
    display: block;
  ` : ''}
  &:hover {
    background: #f7f7f7;
  }
`;

export default Button;
