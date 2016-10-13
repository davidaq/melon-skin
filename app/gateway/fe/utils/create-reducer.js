const existing = {};
let counter = 0;

export default opts => {
  const {
    name = `unamed${++counter}`,
    initialState = {},
    reduce = state => state,
    ...actions,
  } = opts;
  let currentState = initialState;
  if (DEBUG) {
    if (existing[name]) {
      throw new Error(`Reducers with duplicate name [${name}] not allowed`);
    }
    existing[name] = true;
  }
  const resolvedHandlers = {};
  const reducer = (state = initialState, action) => {
    let ret = state;
    if (typeof resolvedHandlers[action.type] === 'function') {
      ret = reduce(state, action.originalType, action.data);
    }
    currentState = ret;
    return ret;
  };
  if (actions) {
    Object.keys(actions).forEach(key => {
      const handler = actions[key];
      if (typeof handler !== 'function') {
        return;
      }
      const resolvedKey = `${name}::${key}`;
      resolvedHandlers[resolvedKey] = handler;
      reducer[key] = (...args) => {
        reducer.state = currentState;
        const result = handler.call(reducer, ...args);
        if (typeof result === 'function') {
          return result;
        } else {
          return {
            data: result,
            type: resolvedKey,
            originalType: key,
          };
        }
      };
    });
  }
  return reducer;
};

export const pass = val => val;
