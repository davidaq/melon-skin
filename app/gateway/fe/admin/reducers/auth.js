import { Component } from 'redux-composer';
import callapi from 'utils/callapi';

const initialState = {
  authorized: window.isAuthed,
};

class Auth extends Component {

  setAuthorized(value = true) {
    return { type: 'SetAuthorized', value };
  }

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
  }

  reduce(state = initialState, action) {
    switch (action.type) {
      case 'SetAuthorized':
        return {
          ...state,
          authorized: action.value,
        };
      default:
        return super.reduce(state, action);
    }
  }
}

export default new Auth;
