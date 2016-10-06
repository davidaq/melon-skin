import createReducer from 'utils/create-reducer';
import { fromJS } from 'immutable';

export default createReducer({
  name: 'auth',
  initialState: fromJS({
    authorized: isAuthed,
  }),
  actions: {
    setAuthorized(state, action) {
      return state.set('authorized', action.value);
    },
  },
});
