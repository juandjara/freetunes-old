import styled from 'styled-components';

const ListStyle = styled.ul`
  opacity: ${props => props.loading ? 0.5 : 1};
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    padding: 2em 0 1em 0;
    img {
      width: 200px;
    }
    .controls {
      margin: 12px;
    }
    p {
      margin: 6px 0;
      text-align: center;
    }
    @media (max-width: 600px) {
      flex-direction: column;
    }
  }
`;

export default ListStyle;
