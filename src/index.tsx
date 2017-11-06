import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
// Store
import configureStore from './redux/store';
// Components
import { default as Throttle } from './components/Throttle';
import { default as Speedometer } from './components/Speedometer'

const store = configureStore();
render(
  <Provider store={store}>
    <div>
      <Throttle />
      <Speedometer />
    </div>
  </Provider>,
  document.getElementById('target')
);