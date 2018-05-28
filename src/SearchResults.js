import React, { Component, Fragment } from 'react';
import qs from 'qs';
import styled from 'styled-components';

const api = 'https://ftunes-api.fuken.xyz';

function parseSong(song) {
  return {
    id: song.id,
    title: song.data.title,
    streamUrl: `${api}/stream/${song.id}`,
    downloadUrl: `${api}/dl/${song.id}?title=${song.data.title}`,
    imageUrl: song.data.thumbnails.default.url
  }
}

const ListStyle = styled.ul`
  opacity: ${props => props.loading ? 0.5 : 1};
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    padding: 1em;
    padding-top: 2em;
    border-bottom: 1px solid #ccc;
    p {
      margin: 14px;
      margin-bottom: 0;
    }
  }
`;
const Button = styled.button`
  background: ${props => props.icon ? 'transparent' : 'white'};
  color: var(--color-accent);
  border-radius: 4px;
  padding: 8px ${props => props.icon ? '8px' : '12px'};
  border: none;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  ${props => props.centered ? `
    margin: 20px auto;
    display: block;  
  ` : ''}
`;

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
      this.setState({
        loading: false,
        results: data.results.map(parseSong).filter(s => s.id),
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
              <div>
                <div>
                  <Button icon="true">
                    <i className="material-icons">play_arrow</i>
                  </Button>
                  <Button icon="true">
                    <i className="material-icons">playlist_add</i>
                  </Button>
                  <Button icon="true">
                    <i className="material-icons">cloud_download</i>
                  </Button>
                </div>
                <p>{result.title}</p>
              </div>
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
 
export default SearchResults;
