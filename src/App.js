import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from './Header';
import Nav from './Nav';
import Playlist from './Playlist';
import SearchResults from './SearchResults';
import { ContextProvider } from './Context';
import Player from './Player';
import Song from './Song';

class App extends Component {
  render() {
    return (
      <ContextProvider>
        <BrowserRouter>
          <Fragment>
            <Header></Header>
            <Nav></Nav>
            <div className="wrapper">
              <Route exact path="/" component={Playlist} />
              <Route path="/search" component={SearchResults} />
              <Route path="/song/:id" component={Song} />
            </div>
            <Player></Player>
          </Fragment>
        </BrowserRouter>
      </ContextProvider>
    );
  }
}

export default App;
