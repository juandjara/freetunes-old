/* global soundManager:false */
import React, { Component } from 'react';
import styled from 'styled-components';
import { withContext } from './Context';
import Sound from 'react-sound';
import Slider from './Slider';

const PlayerStyle = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: var(--color-accent);
  padding: 8px 0;
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
  ${props => props.loading && `
    position: relative;  
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;

      display: block;
      border-radius: 50%;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: 4px solid transparent;
      border-left-color: #e0e0e0;
      animation: spin 1s linear infinite;
    }
  `}
  &:hover {
    opacity: 0.75;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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

class Player extends Component {
  state = {
    paused: false,
    loading: false,
    sound: null,
  }
  componentDidMount () {
    soundManager.setup({debugMode: false});
  }
  togglePlayPause() {
    this.setState(state => ({paused: !state.paused}))
  }

  getPercentPlayed() {
    if (!this.state.sound) {
      return 0;
    }
    const total   = this.state.sound.duration;
    const current = this.state.sound.position;
    return current / total;
  }

  onPlaying(sound) {
    this.setState({
      sound,
      loading: false,
      paused: false
    });
  }

  formatTime(ms) {
    if(!ms && ms !== 0) {
      return '--:--';
    }
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);

    seconds = seconds - (minutes * 60);
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    return `${minutes}:${seconds}`;
  }

  onFinished() {
    this.setState({
      sound: null
    })
  }

  onSlide(value) {
    if (!this.state.sound) {
      return;
    }
    this.setState(state => ({
      sound: {
        ...state.sound, 
        position: value * state.sound.duration
      }
    }))
  }

  render() {
    const {songs, currentSongIndex} = this.props.context;
    const {loading, paused, sound} = this.state;
    const icon = !sound || paused ? 'play_arrow' : 'pause'
    const startTime = this.formatTime(sound && sound.position);
    const endTime = this.formatTime(sound && sound.duration);
    const song = songs[currentSongIndex] || {};
    const playStatus = this.state.paused ? 
      Sound.status.PAUSED : Sound.status.PLAYING;

    return (
      <PlayerStyle>
        <Sound 
          url={song.streamUrl || ""}
          playStatus={playStatus}
          position={sound ? sound.position : 0}
          onLoading={() => this.setState({loading: true})}
          onPlaying={sound => this.onPlaying(sound)}
          onFinishedPlayed={() => this.onFinished()} />
        <PlayControl>
          <Button>
            <i className="material-icons">fast_rewind</i>
          </Button>
          <Button 
            loading={loading} 
            className="playpause" 
            onClick={() => this.togglePlayPause()}>
            <i className="material-icons">{icon}</i>
          </Button>
          <Button>
            <i className="material-icons">fast_forward</i>
          </Button>
        </PlayControl>
        <TimeControl>
          <p>{startTime}</p>
          <Slider
            onChange={ev => this.onSlide(ev.target.value)}
            value={this.getPercentPlayed()}
            innerRef={node => {this.slideNode = node}}
            min={0}
            max={1}
            step={0.01} />
          <p>{endTime}</p>          
        </TimeControl>
      </PlayerStyle>
    );
  }
}

export default withContext(Player);
