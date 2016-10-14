import { combineReducers } from 'redux-composer';
import { routerReducer as routing } from 'react-router-redux';
import auth from './auth';
import robots from './robots';

export default combineReducers({
  auth,
  robots,
  routing,
});
