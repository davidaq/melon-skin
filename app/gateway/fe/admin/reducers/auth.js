import createReducer from 'utils/create-reducer';
import callapi from 'utils/callapi';

export default createReducer({
  name: 'auth',
  initialState: {
    authorized: window.isAuthed,
  },
  reduce(state, type, data) {
    switch (type) {
      case 'setAuthorized':
        return {
          ...state,
          authorized: data,
        };
      default:
        return state;
    }
  },
  setAuthorized(value = true) {
    return !!value;
  },
  login(vals) {
    return async dispatch => {
      const result = await callapi('/login').send(vals)
        .toastError({ title: '登录错误' })
        .toastSuccess({ title: '登录成功' });
      if (result.ok) {
        dispatch(this.setAuthorized(true));
        return true;
      } else {
        return false;
      }
    };
  },
});
