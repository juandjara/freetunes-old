import React, { Component, Fragment } from 'react';
import qs from 'qs';
import { withContext, parseSong } from './Context';
import { api } from './config';
import AutoplayToggle from './AutoplayToggle';
import ListStyle from './ListStyle';
import Button from './Button';
import {Helmet} from "react-helmet";

const DownloadLink = Button.withComponent('a');

class SearchResults extends Component {
  state = {
    query: null,
    loading: false,
    nextPageToken: null,
    results: []
  }
  componentDidMount() {
    const query = this.getQueryFromUrl(this.props);
    if (query) {
      this.fetchSearchResults(query);
    }
  }
  componentWillReceiveProps(nextProps) {
    const newQuery = this.getQueryFromUrl(nextProps);
    if (newQuery !== this.state.query) {
      this.fetchSearchResults(newQuery);
    }
  }
  getQueryFromUrl(props) {
    const querystring = this.props.location.search.substr(1);
    const parsed = qs.parse(querystring);
    return parsed.q;
  }
  fetchSearchResults(query, nextPageToken = '') {
    this.setState({query, loading: true});
    fetch(`${api}/search?q=${query}&nextPageToken=${nextPageToken}`)
    .then(res => res.json())
    .then(data => {
      const prevResults = nextPageToken ? this.state.results : [];
      const newResults = data.results.map(parseSong);
      const results = prevResults.concat(newResults).map(el => {
        el.title = el.title.replace(/&quot;/g, '"')
        return el
      })
      this.props.context.setQueue(results);
      this.setState({
        results,
        loading: false,
        nextPageToken: data.nextPageToken
      });
    })
  }

  playSong(song) {
    this.props.context.set({currentSongId: song.id});
  }

  addToPlaylist(song) {
    this.props.context.addPlaylistSong(song.id);
  }

  render() {
    const {query, loading, results, nextPageToken} = this.state;
    if (results.length === 0 && !loading) {
      return (
        <p style={{textAlign: 'center', marginTop: '2em'}}>
          No hay resultados para esta busqueda
        </p>
      )
    }
    return (
      <Fragment>
        {this.props.context.currentSongId ? null : (
          <Helmet>
            <title>🔍 Freetunes | {query}</title>
          </Helmet>
        )}
        <AutoplayToggle />
        <ListStyle loading={this.state.loading}>
          {results.map(result => (
            <li key={result.id}>
              <img src={result.imageUrl} alt="thumbnail" />
              <div className="controls">
                <Button
                  playing={result.id === this.props.context.currentSongId}
                  onClick={() => this.playSong(result)}
                  title="Reproducir">
                  <i className="material-icons">play_arrow</i>
                </Button>
                <Button onClick={() => this.addToPlaylist(result)} title="Añadir a la lista de reproduccion personal">
                  <i className="material-icons">playlist_add</i>
                </Button>
                <DownloadLink
                  download={`${result.title}.mp3`}
                  href={result.downloadUrl}
                  title="Descargar">
                  <i className="material-icons">cloud_download</i>
                </DownloadLink>
              </div>
              <p>{result.title}</p>
            </li>
          ))}
        </ListStyle>
        {nextPageToken && (
          <Button centered onClick={() => { this.fetchSearchResults(query, nextPageToken) }}>
            Cargar más
          </Button>
        )}
      </Fragment>
    )
  }
}

export default withContext(SearchResults);

