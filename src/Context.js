import React, { createContext, Component } from 'react';

const Context = createContext({
  queue: [],
  autoplay: false,
  currentSongIndex: null,
  set: () => {}
})

export const ContextConsumer = Context.Consumer;
export class ContextProvider extends Component {
  state = {
    queue: [],
    autoplay: false,
    currentSongIndex: null,
    set: (...args) => {
      this.setState(...args);
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
