import Component from './component';

function combinePath(item, key) {
  if (typeof item === 'function' && typeof item.combinePath === 'function') {
    item.combinePath(key);
  }
}

export default function (mapping) {
  const keys = Object.keys(mapping);
  keys.forEach(key => {
    combinePath(mapping[key], key);
  });
  const combined = (state = {}, action) => {
    const newState = {};
    keys.forEach(key => {
      const component = mapping[key];
      const partialState = state[key];
      if (component instanceof Component) {
        newState[key] = component.reduce(partialState, action.type, action);
      } else if (typeof component === 'function') {
        newState[key] = component(partialState, action);
      } else {
        newState[key] = partialState;
      }
    });
    newState.composing = composing;
    return newState;
  };
  combined.combinePath = item => {
    keys.forEach(key => {
      combinePath(mapping[key], item);
    });
  };
  return combined;
}
