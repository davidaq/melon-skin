import { Component } from 'redux-composer';
import callapi from 'utils/callapi';

const initialState = {
  list: [],
  loading: false,
  lastTimeRequested: 0,
};

class Robots extends Component {

  setList(list) {
    return { type: 'SetList', list };
  }

  startLoading() {
    return { type: 'StartLoading' };
  }

  fetchList() {
    return async dispatch => {
      dispatch(this.startLoading());
      const robots = await callapi('listRobots');
      dispatch(this.setList(robots));
    };
  }

  ensure() {
    return async (dispatch, getState) => {
      const { lastTimeRequested } = getState('one');
      if (Date.now() - lastTimeRequested > 5000) {
        dispatch(this.fetchList());
      }
    };
  }

  setName(name, index, api = true) {
    if (api) {
      return async (dispatch, getState) => {
        const { list } = getState('one');
        const { uuid, name: oldName } = list[index];
        dispatch(this.setName(name, index, false));
        try {
          await callapi('setRobotName').send({ uuid, name });
        } catch (e) {
          dispatch(this.setName(oldName, index, false));
        }
      };
    } else {
      return { type: 'SetName', name, index };
    }
  }

  reduce(state = initialState, action) {
    switch (action.type) {
      case 'SetList':
        return {
          ...state,
          list: action.list,
          lastTimeRequested: Date.now(),
          loading: false,
        };
      case 'StartLoading':
        return {
          ...state,
          loading: true,
        };
      case 'SetName':
        return {
          ...state,
          list: [
            ...state.list.slice(0, action.index),
            {
              ...state.list[action.index],
              name: action.name,
            },
            ...state.list.slice(action.index + 1),
          ],
        };
      default:
        return super.reduce(state, action);
    }
  }
}

export default new Robots;
