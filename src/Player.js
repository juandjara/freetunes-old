/* global soundManager:false */
import React, { Component } from 'react';
import styled from 'styled-components';
import { withContext } from './Context';
import { withRouter } from 'react-router-dom';
import Sound from 'react-sound';
import Slider from './Slider';

const PlayerStyle = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: var(--color-accent);
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
  .controls {
    flex-grow: 1;
  }
`;
const Button = styled.button`
  color: white;
  background: transparent;
  border-radius: 4px;
  padding: 8px;
  border: none;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.5s;
  margin: 0 6px;
  &.playpause {
    background: white;
    color: var(--color-accent);
    border-radius: 50%;
  }
  &:hover {
    opacity: 0.75;
  }
`;
const PlayControl = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const TimeControl = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 768px;
  color: white;
  p {
    margin: 4px 8px;
    letter-spacing: 1px;
  }
  input {
    flex: 1 1 auto;
  }
`;
const Cover = styled.div`
  img {
    height: 60px;
  }
`;

class Player extends Component {
  state = {
    paused: false,
    loading: false,
    position: 0,
    sound: null,
  }
  componentDidMount () {
    soundManager.setup({debugMode: false});
  }
  togglePlayPause() {

  }
  render() {
    // const {queue} = this.props.context;
    // const song = queue[0] || {};
    const song = {};
    return (
      <PlayerStyle>
        <Sound 
          url={song.streamUrl || ""}
          playStatus={Sound.status.PLAYING} />
        <Cover>
          <img src={song.imageUrl} alt="" />
          <p>{song.title}</p>
        </Cover>
        <div className="controls">
          <PlayControl>
            <Button>
              <i className="material-icons">fast_rewind</i>
            </Button>
            <Button className="playpause" onClick={() => this.togglePlayPause()}>
              <i className="material-icons">
                {song.paused ? 'play_arrow' : 'pause'}
              </i>
            </Button>
            <Button>
              <i className="material-icons">fast_forward</i>
            </Button>
          </PlayControl>
          <TimeControl>
            <p>00:00</p>
            <Slider
              innerRef={node => {this.slideNode = node}}
              min={0}
              max={1}
              step={0.01} />
            <p>00:00</p>          
          </TimeControl>
        </div>
      </PlayerStyle>
    );
  }
}

export default withRouter(withContext(Player));
