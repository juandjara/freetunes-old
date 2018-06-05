import React, { createContext, Component } from 'react';
import config from './config';

function parseSong(song) {
  return {
    id: song.id,
    title: song.data.title,
    streamUrl: `${config.api}/stream/${song.id}`,
    downloadUrl: `${config.api}/dl/${song.id}?title=${encodeURIComponent(song.data.title)}`,
    imageUrl: song.data.thumbnails.default.url
  }
}


const Context = createContext({
  queue: [],
  songs: {},
  autoplay: false,
  currentSongIndex: null,
  set: () => {}
})

export const ContextConsumer = Context.Consumer;
export class ContextProvider extends Component {
  state = {
    songs: {},
    queue: [],
    autoplay: false,
    currentSongIndex: null,
    set: (...args) => {
      this.setState(...args);
    },
    setQueue: (queue) => {
      const order = queue.map(s => s.id);
      const entities = queue.reduce((prev, next) =>{
        prev[next.id] = parseSong(next);
        return prev;
      }, {})
      this.setState(state => ({
        queue: order,
        songs: {...state.songs, entities}
      }));
    },
    cacheSong: (song) => {
      this.setState(state => ({
        songs: {
          ...state.songs,
          [song.id]: {
            id: song.id,
            title: song.title,
            streamUrl: `${api}/stream/${song.id}`,
            downloadUrl: `${api}/dl/${song.id}?title=${song.title}`,
            imageUrl: song.thumbnails.medium.url
          }
        }
      }))
    }
  }
  render() { 
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export function withContext(WrappedComponent) {
  const ContextWrapper = (props) => (
    <ContextConsumer>
      {context => <WrappedComponent {...props} context={context} />}
    </ContextConsumer>
  );
  return ContextWrapper;
}

export default { withContext, ContextConsumer, ContextProvider };
