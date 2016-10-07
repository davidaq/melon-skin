import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import store from './store';
import './general.styl';


import Navigation from './components/navigation';
import NotFound from './components/not-found';
import AuthSettings from './components/settings/auth';

const history = syncHistoryWithStore(browserHistory, store);

const Dummy = text => () => <div>{text}</div>;

const index = (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Navigation}>
        <IndexRoute component={Dummy('space list')} />
        <Route path="space/create" component={Dummy('space create')} />
        <Route path="space/port" component={Dummy('space port')} />
        <Route path="settings">
          <Route path="auth" component={AuthSettings} />
        </Route>
      </Route>
      <Route path="*" component={NotFound} />
    </Router>
  </Provider>
);

render(index, document.getElementById('APPROOT'));
