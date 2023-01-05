import React, { Component } from 'react';
import styled from 'styled-components';
import { NavLink, withRouter } from 'react-router-dom';
import debounce from 'lodash.debounce';
import axios from 'axios'
import { api } from './config'

const NavStyle = styled.nav`
  max-width: 900px;
  margin: 0 auto;
  margin-top: 42px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  position: relative;
  padding: 0;
  a {
    color: #666;
    padding: 6px 8px;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
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
  font-size: 20px;
  position: relative;
  .material-icons {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: inherit;
  }
  input {
    margin: 4px;
    background: white;
    border: 1px solid white;
    border-radius: 4px;
    padding: 6px 8px;
    padding-right: 32px;
    font-size: 14px;
    line-height: 24px;
    width: 200px;
    max-width: calc(100vw - 150px);
    will-change: width;
    transition: width 0.3s, border-color 0.3s;
    outline: none;
    &:focus {
      width: 275px;
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
  z-index: 2;
  li {
    padding: 6px 12px;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:hover {
      background-color: #eee;
    }
  }
`;

const enterKeycode = 13;
const autocompleteURL = api + '/autocomplete?q=';

class Nav extends Component {
  state = {
    searchResults: [],
    query: null,
    open: false
  }

  debounceKeyup = debounce((query) => {
    this.fetchAutoComplete(query).then(results => {
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

  fetchAutoComplete(query) {
    const url = autocompleteURL + query;
    if(!query) {
      return Promise.resolve([]);
    }
    return axios({
      url,
      method: 'GET',
      responseType: 'text'
    }).then(res => {
      const cleantext = String(res.data).replace(/^.+\(/, '')
        .replace(')', '')
      const data = JSON.parse(cleantext)
      return data[1].map(item => item[0]);
    })
  }

  onFocus() {
    this.setState({open: true});
    document.querySelector('.wrapper').scrollIntoView();
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