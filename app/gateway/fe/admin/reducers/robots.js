import createReducer, { pass } from 'utils/create-reducer';
import callapi from 'utils/callapi';

export default createReducer({
  name: 'robots',
  initialState: {
    list: [],
    loading: false,
    lastTimeRequested: 0,
  },
  reduce(state, type, data) {
    switch (type) {
      case 'setList':
        return {
          ...state,
          list: data,
          lastTimeRequested: Date.now(),
          loading: false,
        };
      case 'setLoading':
        return {
          ...state,
          loading: true,
        };
      case 'setName':
        return {
          ...state,
          list: [
            ...state.list.slice(0, data.index),
            {
              ...state.list[data.index],
              name: data.name,
            },
            ...state.list.slice(data.index + 1),
          ],
        };
      default:
        return state;
    }
  },
  setList: pass,
  setLoading: pass,
  fetchList() {
    return async dispatch => {
      dispatch(this.setLoading());
      const robots = await callapi('listRobots');
      dispatch(this.setList(robots));
    };
  },
  ensure() {
    return async dispatch => {
      const { lastTimeRequested } = this.state;
      if (Date.now() - lastTimeRequested > 5000) {
        dispatch(this.fetchList());
      }
    };
  },
  setName(name, index, api = true) {
    if (api) {
      const { uuid, name: oldName } = this.state.list[index];
      return async dispatch => {
        dispatch(this.setName(name, index, false));
        try {
          await callapi('setRobotName').send({ uuid, name });
        } catch (e) {
          dispatch(this.setName(oldName, index, false));
        }
      };
    } else {
      return { name, index };
    }
  },
});
