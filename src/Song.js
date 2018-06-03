import React, {Component} from 'react';
import { withContext } from './Context';
import styled from 'styled-components';

const SongStyle = styled.div`
  img {
    margin: 0 auto;
    display: block;
    max-width: 90vw;
  }
  p {
    text-align: center;
  }
`;
const Button = styled.button`
  background: none;
  color: #666;
  border-radius: 4px;
  padding: 8px;
  display: block;
  cursor: pointer;
  border: none;
  .material-icons {
    margin-right: 6px;
  }
  &:hover {
    color: #ccc;
  }
`;

const api = 'https://ftunes-api.fuken.xyz';

class Song extends Component {
  componentDidMount() {
    const id = this.props.match.params.id;
    fetch(`${api}/song/${id}`)
    .then(res => res.json())
    .then(json => {
      this.props.context.cacheSong(json);
    })
  }
  render() {
    const id = this.props.match.params.id;
    const song = this.props.context.songs[id];
    
    if (!song) {
      return null;
    }
    
    return (
      <SongStyle>
        <Button onClick={() => { this.props.history.goBack() }}>
          <i className="material-icons">close</i>
          Volver a la lista
        </Button>
        <img src={song.imageUrl} alt=""/>
        <p>{song.title}</p>
      </SongStyle>
    );
  }
}

export default withContext(Song);
