import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { withContext } from './Context';
import AutoplayToggle from './AutoplayToggle';
import ListStyle from './ListStyle';
import Button from './Button';

const EmptyStyle = styled.div`
  text-align: center;
  .material-icons {
    font-size: 36px;
    color: #888;
  }
`;

const DownloadLink = Button.withComponent('a');

class Playlist extends Component {

  componentDidMount() {
    this.props.context.set({queue: this.props.context.userPlaylist})
  }

  removeSong(song) {
    this.props.context.removePlaylistSong(song.id);
  }

  playSong(song) {
    this.props.context.set({currentSongId: song.id});
  }

  render() { 
    const {songs, userPlaylist} = this.props.context;
    const playlist = userPlaylist.map(id => songs[id]);
    if (playlist.length === 0) {
      return (
        <EmptyStyle>
          <i className="material-icons">library_music</i>
          <p>
            Parece que tu playlist esta vacia. Puedes añadir canciones usando la caja de busqueda.            
          </p>
        </EmptyStyle>
      );
    }

    return (
      <Fragment>
        <AutoplayToggle />
        <ListStyle>
          {playlist.map(song => (
            <li key={song.id}>
              <img src={song.imageUrl} alt="thumbnail" />
              <div className="controls">
                <Button
                  playing={song.id === this.props.context.currentSongId}
                  onClick={() => this.playSong(song)}
                  title="Reproducir">
                  <i className="material-icons">play_arrow</i>
                </Button>
                <Button onClick={() => this.removeSong(song)} 
                  title="Eliminar de la lista de reproduccion personal">
                  <i className="material-icons">remove</i>
                </Button>
                <DownloadLink
                  download={`${song.title}.mp3`}
                  href={song.downloadUrl}
                  title="Descargar">
                  <i className="material-icons">cloud_download</i>
                </DownloadLink>
              </div>
              <p>{song.title}</p>
            </li>
          ))}
        </ListStyle>
      </Fragment>
    );
  }
}
 
export default withContext(Playlist);
