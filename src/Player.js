/* global soundManager:false */
import React, { Component } from 'react';
import styled from 'styled-components';
import { withContext } from './Context';
import Sound from 'react-sound';
import Slider from './Slider';
import {Helmet} from "react-helmet";

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

  componentWillReceiveProps(nextProps) {
    const oldSong = this.props.context.currentSongId;
    const newSong = nextProps.context.currentSongId;
    if (oldSong !== newSong) {
      this.slideTo(0);
    }
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
      loading: false
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
    });
    if (this.props.context.autoplay) {
      this.playNext();
    } else {
      this.props.context.set({currentSongId: null});
    }
  }

  slideTo(value) {
    if (!this.state.sound) {
      return;
    }
    this.setState(state => ({
      loading: true,
      sound: {
        ...state.sound, 
        position: value * state.sound.duration
      }
    }))
  }

  playNext() {
    const {songs, currentSongId, queue} = this.props.context;
    const songIndex = queue.indexOf(currentSongId);
    let nextIndex = songIndex + 1;
    if (nextIndex >= queue.lenght) {
      nextIndex = 0;
    }
    const song = songs[queue[nextIndex]];
    if (!song) {
      return;
    }
    this.slideTo(0);
    this.props.context.set({currentSongId: song.id});
  }

  playPrev() {
    const {songs, currentSongId, queue} = this.props.context;
    const songIndex = queue.indexOf(currentSongId);
    let prevIndex = songIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.lenght - 1;
    }
    const song = songs[queue[prevIndex]];
    if (!song) {
      return;
    }
    this.slideTo(0);    
    this.props.context.set({currentSongId: song.id});
  }

  render() {
    const {songs, currentSongId} = this.props.context;
    const {loading, paused, sound} = this.state;
    const icon = !sound || paused ? 'play_arrow' : 'pause'
    const startTime = this.formatTime(sound && sound.position);
    const endTime = this.formatTime(sound && sound.duration);
    const song = songs[currentSongId] || {};
    const playStatus = this.state.paused ? 
      Sound.status.PAUSED : Sound.status.PLAYING;

    return (
      <PlayerStyle>
        {sound && song && (
          <Helmet>
            <title>Freetunes | ▶️ {song.title}</title>
          </Helmet>
        )}
        <Sound 
          url={song.streamUrl || ""}
          playStatus={playStatus}
          position={sound ? sound.position : 0}
          onLoading={() => this.setState({loading: true})}
          onPlaying={sound => this.onPlaying(sound)}
          onFinishedPlaying={() => this.onFinished()} />
        <PlayControl>
          <Button onClick={() => this.playPrev()}>
            <i className="material-icons">fast_rewind</i>
          </Button>
          <Button 
            loading={loading} 
            className="playpause" 
            onClick={() => this.togglePlayPause()}>
            <i className="material-icons">{icon}</i>
          </Button>
          <Button onClick={() => this.playNext()}>
            <i className="material-icons">fast_forward</i>
          </Button>
        </PlayControl>
        <TimeControl>
          <p>{startTime}</p>
          <Slider
            onChange={ev => this.slideTo(ev.target.value)}
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
