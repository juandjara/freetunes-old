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

const savedState = JSON.parse(localStorage.getItem('freetunes_context')) || {};

const Context = createContext({
  queue: [],
  songs: {},
  autoplay: false,
  currentSongId: null,
  ...savedState,
  set: () => {}
})

export const ContextConsumer = Context.Consumer;
export class ContextProvider extends Component {
  state = {
    songs: {},
    queue: [],
    userPlaylist: [],
    autoplay: false,
    currentSongId: null,
    ...savedState,
    set: (modifier) => {
      this.setState(modifier, () => {
        localStorage.setItem(
          'freetunes_context',
          JSON.stringify({
            autoplay: this.state.autoplay,
            userPlaylist: this.state.userPlaylist,
            songs: this.state.songs
          })
        );
        // unos 5MB de almacenamiento darian para unas 7000 canciones cacheadas
      });
    },
    setQueue: (queue) => {
      const order = queue.map(s => s.id);
      const entities = queue.reduce((prev, next) =>{
        prev[next.id] = next;
        return prev;
      }, {})
      this.state.set(state => ({
        queue: order,
        songs: {...state.songs, ...entities}
      }));
    },
    addPlaylistSong: (id) => {
      this.state.set(state => ({
        userPlaylist: [...state.userPlaylist, id]
      }))
    },
    deletePlaylistSong: (id) => {
      this.state.set(state =>({
        userPlaylist: state.userPlaylist.filter(_id => _id !== id)
      }));
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
