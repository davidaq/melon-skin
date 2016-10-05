import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';
import reducers from './reducers';

const store = createStore(
  reducers,
  applyMiddleware(
    routerMiddleware(browserHistory),
    thunk
  )
);

export default store;
