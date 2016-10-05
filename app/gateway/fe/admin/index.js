import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import store from './store';

import Navigation from './components/navigation';
import NotFound from './components/not-found';

const history = syncHistoryWithStore(browserHistory, store);

const index = (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Navigation}>
      </Route>
      <Route path="*" component={NotFound} />
    </Router>
  </Provider>
);

render(index, document.getElementById('APPROOT'));
