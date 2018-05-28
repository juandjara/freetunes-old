import React, { createContext, Component } from 'react';

const Context = createContext({
  getQueue: () => [],
  setQueue: () => {},
  getAutoplay: () => false,
  setAutoplay: () => {}
})

export const ContextConsumer = Context.Consumer;
export class ContextProvider extends Component {
  state = {
    autoplay: false,
    queue: [],
    setQueue: queue => {
      this.setState({queue})
    },
    setAutoplay: autoplay => {
      this.setState({autoplay})
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

export default { ContextConsumer, ContextProvider };
