function getMethods(obj) {
  if (!obj || typeof obj !== 'object') {
    return [];
  }
  const keys = {};
  const set = key => keys[key] = 1;
  Object.getOwnPropertyNames(obj).forEach(set);
  if (typeof ''.__proto__ === 'object') {
    Object.getOwnPropertyNames(obj.__proto__).forEach(set);
  } else if (typeof obj.constructor === 'function') {
    Object.getOwnPropertyNames(obj.constructor.prototype).forEach(set);
  }
  delete keys.constructor;
  delete keys.reduce;
  delete keys.actions;
  return Object.keys(keys).filter(key => typeof obj[key] === 'function');
}

function createLocalDispatch({ dispatch, getState, path, selector, compId }) {
  const localGetState = (type = 'default') => {
    const fullState = getState();
    if (type === 'default') {
      return fullState;
    }
    const selected = selector(fullState);
    if (!compId || type === 'selected') {
      return selected;
    }
    const meta = selector(fullState)['.composing-meta'];
    const matched = meta.comps[compId];
    const result = [];
    for (let i = 0; i < matched.length; i++) {
      const path = matched[i].fullPathArray;
      result.push(path.reduce((obj, item) => obj[item], fullState));
      if (type === 'one') {
        return result[0];
      }
    }
    return result;
  };
  const localDispatch = action => {
    if (typeof action === 'function') {
      action(localDispatch, localGetState);
    } else {
      const type = `@@${action && action.type ? action.type : 'noname'}`;
      return dispatch({ type, path, action });
    }
  };
  return localDispatch;
}

const rootSelector = R => R;

export default function (inst, selector = rootSelector, error) {
  const actions = {};
  getMethods(inst).forEach(key => {
    const type = `#${key}`;
    actions[key] = (...args) => (dispatch, getState) => {
      const currentState = getState();
      const ref = selector(currentState['.composing-meta'].tree);
      let localDispatch;
      if (!ref) {
        error.message = 'Cannot resolve actions from undefined.';
        throw error;
      } else if (ref['composing-leaf']) {
        if (ref.compId !== inst.id) {
          error.message = `${ref.fullPath} is not of type ${inst.constructor.name}`;
          throw error;
        }
        localDispatch = createLocalDispatch({
          dispatch, getState, selector,
          path: ref.fullPath,
        });
      } else {
        localDispatch = createLocalDispatch({
          dispatch, getState, selector,
          path: `${ref['.composing-path']}.`,
          compId: inst['.composing-id'],
        });
      }
      return localDispatch(inst[key].call(inst, ...args));
    };
  });
  return actions;
}
