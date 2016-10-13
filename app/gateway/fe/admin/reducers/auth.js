import { Component } from 'redux-composer';
import callapi from 'utils/callapi';

const initialState = {
  authorized: window.isAuthed,
};

class Auth extends Component {

  setAuthorized(value = true) {
    return !!value;
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

  reduce(state = initialState, type, data) {
    switch (type) {
      case 'setAuthorized':
        return {
          ...state,
          authorized: data,
        };
      default:
        return super.reduce(state, type, data);
    }
  }
}

export default new Auth;
