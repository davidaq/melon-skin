import Component from './component';
import pathToString from './path-to-string';

function combinePath(item, key) {
  if (typeof item === 'function' && typeof item.combinePath === 'function') {
    return item.combinePath(key);
  }
  return null;
}

function matchPath(part, full) {
  if (typeof part !== 'string') {
    return false;
  }
  if (part === full) {
    return true;
  }
  if (/\.$/.test(part)) {
    return full.substr(0, part.length) === part;
  }
  return false;
}

export default function (mapping) {
  const keys = Object.keys(mapping);
  const path = [];
  const tree = {};
  const comps = {};
  const meta = { tree, comps };
  tree['.composing-path'] = path;
  let composingResolved = false;
  keys.forEach(key => {
    const component = mapping[key];
    const childMeta = combinePath(component, key);
    if (childMeta) {
      tree[key] = childMeta.tree;
      Object.keys(childMeta.comps).forEach(compId => {
        if (!comps[compId]) {
          comps[compId] = [];
        }
        comps[compId] = comps[compId].concat(childMeta.comps[compId]);
      });
    } else {
      tree[key] = {
        '.composing-leaf': true,
        parent: path,
        name: key,
      };
      if (component instanceof Component) {
        const compId = component['.composing-id'];
        tree[key].compId = compId;
        if (!comps[compId]) {
          comps[compId] = [];
        }
        comps[compId].push(tree[key]);
      }
    }
  });
  const combined = (state = {}, action) => {
    if (!composingResolved) {
      composingResolved = true;
      keys.forEach(key => {
        const composeItem = tree[key];
        if (composeItem['.composing-leaf']) {
          composeItem.fullPathArray = [...composeItem.parent, composeItem.name];
          composeItem.fullPath = pathToString(composeItem.fullPathArray);
          delete composeItem.parent;
          delete composeItem.name;
        }
      });
      tree['.composing-path'] = pathToString(path);
    }
    const newState = {};
    keys.forEach(key => {
      const component = mapping[key];
      const partialState = state[key];
      newState[key] = partialState;
      if (component instanceof Component) {
        if (action && typeof action === 'object' && matchPath(action.path, tree[key].fullPath)) {
          newState[key] = component.reduce(partialState, action.action);
        } else {
          newState[key] = component.reduce(partialState, {});
        }
      } else if (typeof component === 'function') {
        newState[key] = component(partialState, action);
      }
    });
    newState['.composing-meta'] = meta;
    return newState;
  };
  combined.combinePath = item => {
    path.unshift(item);
    keys.forEach(key => {
      combinePath(mapping[key], item);
    });
    return {
      tree,
      comps,
    };
  };
  return combined;
}
