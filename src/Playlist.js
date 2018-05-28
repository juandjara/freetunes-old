import React, { Component } from 'react';
import styled from 'styled-components';

const PlaylistStyle = styled.div`
  .empty {
    text-align: center;
    .material-icons {
      font-size: 36px;
      color: #888;
    }
  }
`;

class Playlist extends Component {
  state = {}
  render() { 
    return (
      <PlaylistStyle>
        <div className="empty">
          <i className="material-icons">library_music</i>
          <p>
            Parece que tu playlist esta vacia. Puedes añadir canciones usando la caja de busqueda.            
          </p>
        </div>
      </PlaylistStyle>
    )
  }
}
 
export default Playlist;
