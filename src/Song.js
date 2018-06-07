import React, {Component} from 'react';
import { withContext, parseSong } from './Context';
import styled from 'styled-components';
import {api} from './config';

const SongStyle = styled.div`
  img {
    margin: 8px auto 1em auto;
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
  padding: 0;
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

class Song extends Component {
  componentDidMount() {
    const id = this.props.match.params.id;
    const song = this.props.context.songs[id];

    if (!song) {
      fetch(`${api}/song/${id}`)
      .then(res => res.json())
      .then(json => {
        this.props.context.cacheSong(parseSong(json));
      })
    }

    this.props.context.set({currentSongId: id});
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
          <i className="material-icons">keyboard_arrow_down</i>
          Minimizar
        </Button>
        <img src={song.imageUrl} alt=""/>
        <p>{song.title}</p>
      </SongStyle>
    );
  }
}

export default withContext(Song);
