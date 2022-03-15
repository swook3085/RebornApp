import React, { Component } from 'react';
import Main from './Component/Main';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './Redux/Reducers/Reducer';

const store = createStore(reducers);

class App extends Component {
  render() {
    return (
      <>
        <Provider store={store}>
          <Main />
        </Provider>
      </>
    );
  }
}

export default App;
