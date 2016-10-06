const existing = {};
let counter = 0;

export default opts => {
  const {
    name = `unamed${++counter}`,
    initialState = {},
    actions = {}
  } = opts;
  if (DEBUG) {
    if (existing[name]) {
      throw new Error(`Reducers with duplicate name [${name}] not allowed`);
    }
    existing[name] = true;
  }
  const resolvedHandlers = {};
  const reducer = (state = initialState, action) => {
    const handler = resolvedHandlers[action.type];
    if (typeof handler === 'function') {
      return handler(state, action, initialState);
    }
    return state;
  };
  Object.keys(actions).forEach(key => {
    const handler = actions[key];
    if (typeof handler === 'function') {
      const resolvedKey = `${name}::${key}`;
      resolvedHandlers[resolvedKey] = handler;
      reducer[key] = args => ({
        ...args,
        type: resolvedKey,
      });
    }
  });
  return reducer;
};
