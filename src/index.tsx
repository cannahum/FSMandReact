import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
// Store
import configureStore from './redux/store';
// Components
import { default as Throttle } from './components/Throttle';

const store = configureStore();
render(
  <Provider store={store}>
    <Throttle />
  </Provider>,
  document.getElementById('target')
);