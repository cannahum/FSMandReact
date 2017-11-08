import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
// Store
import configureStore from './redux/store';
// Components
import { default as Throttle } from './components/Throttle';
import { default as Speedometer } from './components/Speedometer'
import App from './components/App';

// Styles
import * as injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const store = configureStore();
render(
  <MuiThemeProvider>
    <Provider store={store}>
      <App>
        <Throttle />
        <Speedometer />
      </App>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('target')
);