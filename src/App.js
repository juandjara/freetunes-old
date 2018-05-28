import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from './Header';
import Nav from './Nav';
import Playlist from './Playlist';
import SearchResults from './SearchResults';
import { ContextProvider } from './Context';

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
            </div>
          </Fragment>
        </BrowserRouter>
      </ContextProvider>
    );
  }
}

export default App;
