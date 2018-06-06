import React, { createContext, Component } from 'react';
import {api} from './config';
import slug from 'slug';

export function parseSong(song) {
  return {
    id: song.id,
    title: song.title,
    streamUrl: `${api}/stream/${song.id}`,
    downloadUrl: `${api}/dl/${song.id}?title=${slug(song.title, '_')}`,
    imageUrl: song.thumbnails.medium.url
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
          [song.id]: parseSong(song)
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
