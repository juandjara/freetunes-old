import React, { Component } from 'react';
import styled from 'styled-components';
import { NavLink, withRouter } from 'react-router-dom';
import debounce from 'lodash.debounce';
import jsonp from 'jsonp';

const NavStyle = styled.nav`
  max-width: 900px;
  margin: 20px auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  position: relative;
  a {
    color: #666;
    padding: 6px 8px;
    border-bottom: 2px solid transparent;
    .material-icons {
      margin-right: 4px;
    }
    &:hover, &:focus, &.active {
      border-color: currentColor;
    }
    &.active {
      color: var(--color-link);
    }
  }
`;

const SearchStyle = styled.div`
  font-size: 16px;
  position: relative;
  .material-icons {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: inherit;
  }
  input {
    margin: 4px;
    background: white;
    border: 1px solid white;
    padding: 6px 8px;
    border-radius: 4px;
    padding-left: 22px;
    font-size: 12px;
    width: 120px;
    transition: all 0.3s;
    outline: none;
    &:focus {
      width: 165px;
      border-color: var(--color-accent);
    }
  }
`;

const ResultsStyle = styled.ul`
  display: ${props => props.open ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  right: 0;
  padding: 10px 0;
  margin: 4px 12px 0 0;
  list-style: none;
  background-color: white;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 4px;
  max-width: 290px;
  li {
    padding: 6px 12px;
    font-size: 14px;
    oveflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:hover {
      background-color: #eee;
    }
  }
`;

const enterKeycode = 13;

const googleAutoSuggestURL = '//suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=';

class Nav extends Component {
  state = {
    searchResults: [],
    query: null,
    open: false
  }

  debounceKeyup = debounce((query) => {
    this.fetchAutoSuggest(query).then(results => {
      console.log('results: ', results);
      this.setState({searchResults: results, loading: false})
    });
  }, 300);

  onKeyUp(ev) {
    const query = ev.target.value;
    if (ev.keyCode === enterKeycode) {
      this.onSelectResult(query);
    }
    this.debounceKeyup(query);
  }

  fetchAutoSuggest(query) {
    const url = googleAutoSuggestURL + query;
    if(!query) {
      return Promise.resolve([]);
    }
    return new Promise((resolve, reject) => {
      jsonp(url, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        const results = data[1].map(item => item[0]);
        resolve(results);
      })
    })
  }

  onFocus() {
    this.setState({open: true});
  }

  onBlur() {
    this.setState({open: false});
  }

  onSelectResult(result) {
    this.setState({query: result});
    this.props.history.push(`/search?q=${result}`);
  }

  render() { 
    return (
      <NavStyle className="wrapper">
        <NavLink exact to="/" activeClassName="active">
          <i className="material-icons">queue_music</i>
          Playlist
        </NavLink>
        <SearchStyle>
          <i className="material-icons">search</i>
          <input type="text" 
            value={this.state.query || ''}
            placeholder="Busca canciones en youtube"
            onFocus={() => this.onFocus()}
            onBlur={() => this.onBlur()}
            onChange={ev => this.setState({query: ev.target.value})}
            onKeyUp={ev => this.onKeyUp(ev)} />
        </SearchStyle>
        <ResultsStyle open={this.state.open}>
          {this.state.searchResults.map((result, index) => (
            <li key={`${index}_${result}`} 
              onMouseDown={() => this.onSelectResult(result)}>
              {result}
            </li>
          ))}
        </ResultsStyle>
      </NavStyle>
    );
  }
}
 
export default withRouter(Nav);