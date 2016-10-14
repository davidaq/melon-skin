import select from './select';

const defaultInitialState = {};

let counter = 0;

class Component {

  constructor() {
    const name = typeof this.constructor === 'function' ? this.constructor.name : '-';
    this['.composing-id'] = `#${++counter}#${name}`;
  }

  reduce(state = defaultInitialState) {
    return state;
  }

  actions(selector) {
    return select(this, selector, new Error());
  }
}

export default Component;
