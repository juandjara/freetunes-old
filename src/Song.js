import React, {Component} from 'react';
import { withContext } from './Context';
import styled from 'styled-components';

const SongStyle = styled.div`
  img {
    margin: 1em auto;
    display: block;
    max-width: 100%;
    box-sizing: border-box;
  }
  p {
    text-align: center;
  }
`;
const Button = styled.button`
  background: none;
  color: #666;
  border-radius: 4px;
  margin: 0 auto;
  display: block;
  cursor: pointer;
  border: none;
  font-size: 14px;
  .material-icons {
    margin-right: 6px;
    font-size: 20px;
    vertical-align: middle;
  }
  &:hover {
    opacity: 0.75;
  }
`;

const api = 'https://ftunes-api.fuken.xyz';

class Song extends Component {
  componentDidMount() {
    const id = this.props.match.params.id;
    const song = this.props.context.songs[id];

    if (!song) {
      fetch(`${api}/song/${id}`)
      .then(res => res.json())
      .then(json => {
        this.props.context.cacheSong(json);
      })
    }

    this.props.context.set({currentSongIndex: id});
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
