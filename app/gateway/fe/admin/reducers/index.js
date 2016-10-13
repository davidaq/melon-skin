import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import auth from './auth';
import robots from './robots';

export default combineReducers({
  auth,
  routing,
  robots,
});
