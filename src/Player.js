import React, { Component } from 'react';
import styled from 'styled-components';
import { withContext } from './Context';
import Sound from 'react-sound';

const PlayerStyle = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: var(--color-accent);
  padding: 6px;
`;
const Button = styled.button`
  background: white;
  color: var(--color-accent);
  border-radius: 4px;
  padding: 8px;
  border: none;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  & + button {
    margin-left: 6px;
  }
  &:hover {
    background: #f7f7f7;
  }
`;


class Player extends Component {


  render() {
    const {queue, currentSongIndex} = this.props.context;
    const song = queue[0] || {};
    return (
      <PlayerStyle>
        <div>
          <Button>
            <i className="material-icons">fast_rewind</i>
          </Button>
          <Button onClick={() => this.togglePlayPause()}>
            <i className="material-icons">
              {song.paused ? 'play_arrow' : 'pause'}
            </i>
          </Button>
          <Button>
            <i className="material-icons">fast_forward</i>
          </Button>
        </div>
        <Sound 
          url={song.streamUrl || ""}
          playStatus={Sound.status.PLAYING} />
      </PlayerStyle>
    );
  }
}

export default withContext(Player);
