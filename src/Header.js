import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

const HeaderStyle = styled.header`
  text-align: center;
  margin: 1rem 0;
  a {
    text-decoration: none;
  }
  .material-icons {
    color: white;
    background: var(--color-accent);
    padding: 12px;
    border-radius: 50%;
    margin: 1rem 0;
    font-size: 32px;
  }
  h1 {
    margin: 12px 0;
    font-size: 2em;
    font-weight: 500;
    color: #333;
  }
  h2 {
    color: #888;
    margin: 0;
    font-size: 1.5em;
    font-weight: 300;
  }
`;

const Header = () => {
  return (
    <HeaderStyle>
      <Link to="/">
        <i className="material-icons">music_note</i>
        <h1>Freetunes</h1>
        <h2>Tu m&uacute;sica de fondo</h2>
      </Link>
    </HeaderStyle>
  )
}
 
export default Header;
