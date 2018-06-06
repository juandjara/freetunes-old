import React, { Component, Fragment } from 'react';
import qs from 'qs';
import styled from 'styled-components';
import { withContext, parseSong } from './Context';
import { Link } from 'react-router-dom';
import { api } from './config';

const ListStyle = styled.ul`
  opacity: ${props => props.loading ? 0.5 : 1};
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    padding: 2em 0 1em 0;
    img {
      width: 200px;
    }
    .controls {
      margin: 12px;
    }
    p {
      margin: 6px 0;
      text-align: center;
    }
    @media (max-width: 600px) {
      flex-direction: column;
    }
  }
`;
const Button = styled.button`
  background: ${props => props.playing ? '#f7f7f7' : 'white'};
  color: var(--color-accent);
  border-radius: 4px;
  padding: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
  margin: 0 6px;
  ${props => props.centered ? `
    margin: 20px auto;
    padding: 8px 12px;
    display: block;
  ` : ''}
  &:hover {
    background: #f7f7f7;
  }
`;
const PlayLink = Button.withComponent(Link);
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
      const results = prevResults.concat(newResults);
      this.props.context.set({queue: results});
      this.setState({
        results,
        loading: false,
        nextPageToken: data.nextPageToken
      });
    })
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
        <ListStyle loading={this.state.loading}>
          {results.map(result => (
            <li key={result.id}>
              <img src={result.imageUrl} alt="thumbnail" />
              <div className="controls">
                <PlayLink
                  playing={result.id === this.props.context.currentSongId}
                  to={`/song/${result.id}`} 
                  title="Reproducir">
                  <i className="material-icons">play_arrow</i>
                </PlayLink>
                <Button title="Añadir a la playlist">
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

